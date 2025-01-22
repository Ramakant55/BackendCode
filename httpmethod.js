const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "RamDb";
const collectionName = "testCollection";

// Connect to MongoDB
let db;
MongoClient.connect(uri)
  .then((client) => {
    console.log("Connected Successfully");
    db = client.db(dbName);
  })
  .catch((err) => console.error("Failed to Connect with MongoDB", err));

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (url.startsWith('/data')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const data = body ? JSON.parse(body) : {};

      try {
        // Handle GET request
        if (method === 'GET') {
          const documents = await db.collection(collectionName).find().toArray();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(documents));
        }
        // Handle POST request
        else if (method === 'POST') {
          const result = await db.collection(collectionName).insertOne(data);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ insertedId: result.insertedId, ...data }));
        }
        // Handle PUT request
        else if (method === 'PUT') {
          const { id} = data; // Extract and exclude `id`
          const result = await db.collection(collectionName).replaceOne(
            { _id: new ObjectId(id) },
            data
          );
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred', details: error.message }));
      }
    });
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
