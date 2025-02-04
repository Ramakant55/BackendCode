const http = require("http");
const { MongoClient } = require("mongodb");

// MongoDB connection URL and client setup
const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const dbName = "questions3";
const collectionName = "userCollection";

let db;

// Connect to MongoDB
client.connect()
  .then(() => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Stop the server if DB connection fails
  });

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const { method, url } = req;
//for fetching all users
if (req.method === 'GET' && req.url === '/data') {
  // Fetch data from MongoDB
  db.collection('userCollection').find().toArray()
    .then(users => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    })
    .catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Failed to fetch data" }));
    });
}

  else if (url === "/user" && method === "GET") {
    try {
      const documents = await db.collection(collectionName).find({}, { projection: { username: 1, _id: 0 } }).toArray();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(documents));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch data" }));
    }
  } 
  //for user creation
  else if (url === "/user" && method === "POST") {
    let body = "";
    
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const data = body ? JSON.parse(body) : [];
        const result = await db.collection(collectionName).insertMany(data);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ insertedIds: result.insertedIds }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to insert data" }));
      }
    });
  } 


  //for contact
  else if (url === "/contact" && method === "GET") {
    try {
      const message = { contact: "This is my contact number: 9828784436" };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(message));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch data" }));
    }
  }
  //for profile
  else if (url === "/profile" && method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>User Profile</title>
        </head>
        <body>
          <h1>This is my profile</h1>
          <form action="/login" method="POST">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username"><br><br>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password"><br><br>
            <button type="submit">Login</button>
            <button type="button" onclick="alert('Signup Clicked!')">Signup</button>
          </form>
        </body>
        </html>
      `);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch data" }));
    }
  }
// for job apply form
  else if (url === "/job-apply" && method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Job Application Form</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    form {
      width: 500px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    label {
      display: block;
      margin-bottom: 10px;
    }
    input[type="text"], input[type="email"], input[type="tel"], textarea {
      width: 100%;
      height: 40px;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    textarea {
      height: 100px;
      resize: vertical;
    }
    select {
      width: 100%;
      height: 40px;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    button[type="submit"] {
      width: 100%;
      height: 40px;
      background-color: #4CAF50;
      color: #fff;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button[type="submit"]:hover {
      background-color: #3e8e41;
    }
  </style>
        </head>
        <body>
          <form action="/apply" method="POST">
    <h2>Job Application Form</h2>
    <label for="name">Full Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="email">Email Address:</label>
    <input type="email" id="email" name="email" required>
    <label for="phone">Phone Number:</label>
    <input type="tel" id="phone" name="phone" required>
    <label for="jobtitle">Job Title:</label>
    <select id="jobtitle" name="jobtitle">
      <option value="">Select a job title</option>
      <option value="software-engineer">Software Engineer</option>
      <option value="data-scientist">Data Scientist</option>
      <option value="product-manager">Product Manager</option>
    </select>
    <label for="resume">Upload Resume:</label>
    <input type="file" id="resume" name="resume" required>
    <label for="coverletter">Cover Letter:</label>
    <textarea id="coverletter" name="coverletter" required></textarea>
    <button type="submit">Apply Now</button>
  </form>
        </body>
        </html>
      `);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch data" }));
    }
  }

  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});


// Start the server
server.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});