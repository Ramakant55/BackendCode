const http = require("http");
const { MongoClient } = require("mongodb");

// MongoDB Atlas connection URL
const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";

const dbName = "Newusers";
const collectionName = "userCollections";

// Global database variable
let db;

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
    .then(async (client) => {
        db = client.db(dbName); // Assign the connected database instance to the global `db` variable
        
        // Create a unique index on the email field
        try {
            await db.collection(collectionName).createIndex({ email: 1 }, { unique: true });
            console.log("Unique index created on email field");
        } catch (error) {
            console.error("Error creating index:", error);
        }
        
        console.log("Connected to MongoDB and ensured unique email index");
    })
    .catch((err) => console.error("Failed to connect with MongoDB", err));

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    if (url.startsWith('/data')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const data = body ? JSON.parse(body) : [];
            
            if (method === 'POST' && url === '/data') {
                try {
                    // Ensure `db` is connected before using it
                    if (!db) {
                        throw new Error("Database connection is not established");
                    }

                    // Insert multiple users
                    const result = await db.collection(collectionName).insertMany(data);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ insertedCount: result.insertedCount, insertedIds: result.insertedIds }));
                } catch (error) {
                    // Handle duplicate email error
                    if (error.code === 11000) {  // MongoDB duplicate key error code
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: "Duplicate email address found" }));
                    } else {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message || "An error occurred while inserting data" }));
                    }
                }
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
