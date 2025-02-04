//Restaurent List send to mongodb with the help of Postman with get or post method
const http = require("http");
const { MongoClient} = require("mongodb");

// MongoDB Atlas connection URL 
const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";
const dbName = "restaurent";
const collectionName = "restaurentCollection";

// Connect to MongoDB
let db;
MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
    db = client.db(dbName);
})
    .catch((err) => console.error("Failed to connect with mongodb", err));  


//postman route for data sending with get or post method
const server = http.createServer(async (req, res) => {
    const { method, url } = req;    
    try {
        if (url.startsWith('/data')) {
            let body = '';  
            req.on('data', (chunk) => {
                body += chunk.toString();
            }); 
            req.on('end', async () => {
                const data = body ? JSON.parse(body) : {};
             
                if (method === 'GET') {
                    const documnets = await db.collection(collectionName).find().toArray();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(documnets));
                }
               
                else if (method === 'POST') {
                    const result = await db.collection(collectionName).insertMany(data);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ inserted: result.insertId, ...data }));
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred' }));        
    }

});
server.listen(3000);
console.log("Server running on port 3000");

