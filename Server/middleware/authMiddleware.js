const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Authorization" header

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the token payload to `req.user`
    next();  // Move to the next middleware or route
  } catch (error) {
    res.status(403).json({ error: "Invalid token, authorization denied!" });
  }
};

module.exports = authenticateJWT;
