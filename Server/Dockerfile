# Step 1: Use Node.js base image
FROM node:16

# Step 2: Set working directory in the container
WORKDIR /server

# Step 3: Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the Express application
COPY . .

# Step 5: Expose the port the Express app will run on
EXPOSE 5000

# Step 6: Start the Express app
CMD ["node", "server.js"]
