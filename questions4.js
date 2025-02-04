const http = require("http");
const { MongoClient } = require("mongodb");

const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const dbName = "questions4";
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

// Server setup
const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/updateUserAges') {
        try {
            // Get the current date
            const currentDate = new Date();

            // Calculate the date that is 5 years ago
            const fiveYearsAgo = new Date(currentDate);
            fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

            // Perform the update operation
            const result = await db.collection(collectionName).updateMany(
                { registrationDate: { $lt: fiveYearsAgo } }, // Match users registered more than 5 years ago
                { $inc: { age: 1 } } // Increment the age by 1
            );

            // Respond with the number of updated users
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `${result.modifiedCount} users were updated.` }));
        } catch (error) {
            console.error("An error occurred while updating user ages:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'An error occurred while updating user ages.' }));
        }
    } else if (req.method === 'POST' && req.url === '/senddata') {
        try {
            await db.collection(collectionName).insertMany([
                { name: "John", age: 30, registrationDate: new Date("2015-01-01") },
                { name: "Alice", age: 25, registrationDate: new Date("2012-06-15") },
                { name: "Bob", age: 40, registrationDate: new Date("2010-09-10") }
            ]);

            // Respond to indicate that data was inserted successfully
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data inserted successfully.' }));
        } catch (error) {
            console.error("An error occurred while sending data:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'An error occurred while sending data.' }));
        }
    } else {
        // Set response for unsupported methods or routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found.' }));
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});