//Handling Arrays: How would you add a new phone number to a user's list of phone numbers only if it isn't already in the list?
const http = require("http");
const { MongoClient } = require("mongodb");

// MongoDB Atlas connection URL
const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const dbName = "user";
const collectionName = "users";

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
// Create an HTTP server
const server = http.createServer((req, res) => {
    const { method, url } = req;
    if (method === 'POST' && url === '/updatemobile') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const data = body ? JSON.parse(body) : {};
            const { name, phone } = data;
            if (!name || !phone) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Name and phone are required' }));
                return;
            }
            try {
                await db.collection(collectionName).updateOne({ name }, { $push: { phone } }, { upsert: true });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Phone number added successfully' }));
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'An error occurred' }));
            }
        });
    }   
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);  
});