const express = require("express");
const session = require('express-session');
const db = require("../db");
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const SESSION_SECRET = process.env.SESSION_SECRET || "default_session_secret";

const acceptedRequests = {}; // In-memory store for accepted requests

function padNumber(num) {
  const size = 3;
  let numStr = num.toString();
  while (numStr.length < size) {
    numStr = "0" + numStr;
  }
  return numStr;
}

router.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }
}));

router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM user_management";
    const result = await db.query(query);
    res.send(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    const emailCheckQuery = "SELECT * FROM user_management WHERE email = $1";
    const emailCheckResult = await db.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "A user with this email already exists",
      });
    }

    const countQuery = "SELECT count(*) FROM user_management WHERE role = $1";
    const countResult = await db.query(countQuery, [role]);
    let count = Number(countResult.rows[0].count);

    const id = role + padNumber(count + 1);

    const insertQuery = "INSERT INTO user_management(userid, username, email, role, password) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [id, username, email, role, password];
    const insertedUser = await db.query(insertQuery, values);

    req.session.user = {
      id: insertedUser.rows[0].userid,
      role: insertedUser.rows[0].role,
    };

    res.json({ success: true, user: insertedUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userQuery = {
      text: "SELECT * FROM user_management WHERE email = $1",
      values: [email],
    };
    const userResult = await db.query(userQuery);
    const user = userResult.rows[0];

    if (!user || password !== user.password) {
      return res.status(400).json({
        success: false,
        error: "Please try to login with correct credentials",
      });
    }

    req.session.user = {
      id: user.userid,
      role: user.role,
    };

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user.userid,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret_key", // Ensure the secret key is set
      { expiresIn: "1h" } // Adjust the token expiry as needed
    );

    // Send token, email, and role in the response body
    res.json({
      success: true,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/update", async (req, res) => {
  const { userid, username, email, role, password } = req.body;

  try {
    const updateQuery = `
      UPDATE user_management
      SET username = $2, email = $3, role = $4, password = $5
      WHERE userid = $1
      RETURNING *;
    `;
    const values = [userid, username, email, role, password];
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/youtube", async (req, res) => {
  try {
    const { url, title } = req.body;

    const insertQuery = "INSERT INTO youtube_videos(url, title) VALUES($1, $2) RETURNING *";
    const values = [url, title];
    const insertedVideo = await db.query(insertQuery, values);

    res.json({ success: true, video: insertedVideo.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/youtube", async (req, res) => {
  try {
    const selectQuery = "SELECT * FROM youtube_videos";
    const result = await db.query(selectQuery);

    res.json({ success: true, videos: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// New route to handle email sending
router.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pagadalanagendra2003@gmail.com', // Replace with your email
      pass: 'sbqn aztv cezy vacl', // Replace with your email password
    },
  });

  // Setup email data
  let mailOptions = {
    from: email, // Sender address
    to: 'pagadalanagendra2003@gmail.com', // List of receivers
    subject: 'Message from ' + email, // Subject line
    text: message, // Plain text body
    html: `<p>${message}</p>
           <form action="http://localhost:8000/auth/accept-request" method="GET">
             <input type="hidden" name="email" value="${email}" />
             <input type="hidden" name="option" value="${message}" />
             <label for="deadlineType">Select Deadline Type:</label>
             <select name="deadlineType" id="deadlineType">
               <option value="minutes">Minutes</option>
               <option value="hours">Hours</option>
               <option value="days">Days</option>
               <option value="weeks">Weeks</option>
               <option value="months">Months</option>
               <option value="years">Years</option>
             </select>
             <label for="deadlineValue">Enter Deadline Value:</label>
             <input type="number" name="deadlineValue" id="deadlineValue" required />
             <button type="submit">Accept Request</button>
           </form>`, // HTML body with form
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, error: 'Failed to send email' });
    }
    res.json({ success: true, message: 'Email sent successfully' });
  });
});

// New route to handle request acceptance
router.get("/accept-request", async (req, res) => {
  const { email, option, deadlineType, deadlineValue } = req.query;

  // Calculate the deadline based on the deadlineType and deadlineValue
  const deadline = new Date();
  if (deadlineType === 'minutes') {
    deadline.setMinutes(deadline.getMinutes() + parseInt(deadlineValue));
  } else if (deadlineType === 'hours') {
    deadline.setHours(deadline.getHours() + parseInt(deadlineValue));
  } else if (deadlineType === 'days') {
    deadline.setDate(deadline.getDate() + parseInt(deadlineValue));
  } else if (deadlineType === 'weeks') {
    deadline.setDate(deadline.getDate() + parseInt(deadlineValue) * 7);
  } else if (deadlineType === 'months') {
    deadline.setMonth(deadline.getMonth() + parseInt(deadlineValue));
  } else if (deadlineType === 'years') {
    deadline.setFullYear(deadline.getFullYear() + parseInt(deadlineValue));
  }

  // Store the accepted request in the in-memory store with a deadline
  acceptedRequests[email] = acceptedRequests[email] || {};
  acceptedRequests[email][option] = { accepted: true, deadline };

  // Insert the accepted request into the database
  const insertQuery = "INSERT INTO accepted_requests(email, option, deadline) VALUES($1, $2, $3) RETURNING *";
  const values = [email, option, deadline];
  try {
    await db.query(insertQuery, values);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: 'Failed to store accepted request in database' });
  }

  // Send an email to the user notifying them that their request has been accepted
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pagadalanagendra2003@gmail.com', // Replace with your email
      pass: 'sbqn aztv cezy vacl', // Replace with your email password
    },
  });

  let mailOptions = {
    from: 'pagadalanagendra2003@gmail.com', // Sender address
    to: email, // List of receivers
    subject: 'Your request has been accepted', // Subject line
    text: `Your request for ${option} has been accepted. You can now access the data until ${deadline}.`, // Plain text body
    html: `<p>Your request for <strong>${option}</strong> has been accepted. You can now access the data until <strong>${deadline}</strong>.</p>`, // HTML body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, error: 'Failed to send notification email' });
    }
    res.send(`<p>Request for ${option} accepted. You can now access the data until ${deadline}.</p>`);
  });
});

// New route to check if the request is accepted and within the deadline
router.get("/check-request", async (req, res) => {
  const { email, option } = req.query;

  if (acceptedRequests[email] && acceptedRequests[email][option]) {
    const { accepted, deadline } = acceptedRequests[email][option];
    if (accepted && new Date() < new Date(deadline)) {
      res.json({ success: true, message: `Request for ${option} accepted`, deadline });
    } else {
      res.json({ success: false, message: `Request for ${option} has expired` });
    }
  } else {
    res.json({ success: false, message: `Request for ${option} not accepted` });
  }
});

router.get("/check-requestsgh", async (req, res) => {
  try {
    const selectQuery = "SELECT * FROM accepted_requests";
    const result = await db.query(selectQuery);

    res.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;