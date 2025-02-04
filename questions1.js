const http = require("http");
const { MongoClient } = require("mongodb");

// MongoDB Atlas connection URL
const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const dbName = "Newuser";
const collectionName = "userCollection";

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    if (method === "GET" && url === "/find-users") {
        try {
            // Connect to MongoDB
            await client.connect();

            // Access the database and collection
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            // Perform the query: Users who are 25 years old or name starts with 'J'
            const results = await collection.find({
                $or: [
                    { age: 25 },
                    { name: { $regex: "^J", $options: "i" } }
                ]
            }).toArray();

            // Respond with the results
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        } catch (err) {
            console.error("Error in Querying", err.message);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "An error occurred" }));
        } finally {
            await client.close();
        }
    }
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
