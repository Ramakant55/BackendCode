//server create=->http module
const http = require('http');
// const { ObjectId } = require('mongodb');

const { MongoClient, ObjectId } = require('mongodb');

// url for connection

const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";
const dbNAme = "user";
const colllectionName = "testCollection"

//connect to mongodb

let db;
MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
    db = client.db(dbNAme);
})
    .catch((err) => console.error("Failed to connect with mongodb", err));

//create http server

const server = http.createServer(async (req, res) => {

    const { method, url } = req;
    if (url.startsWith('/data')) {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();

        })

        req.on('end', async () => {
            const data = body ? JSON.parse(body) : {};
            // 1. Get Method
            if (method === 'GET') {
                const documnets = await db.collection(colllectionName).find().toArray();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(documnets));
            }
            //POST METHOD

            else if (method === 'POST')
            //INSERT the data
            {
                //1.InsertONE 2.InsertMAny

                const result = await db.collection(colllectionName).insertOne(data);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ inserted: result.insertId, ...data }));
            }

            else if (method === 'PUT')
             {
                const { id } = data;
                const result = await db.collection(colllectionName).replaceOne({_id: new ObjectId(id) },
                    data
                );
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }

            // else if (method === 'PUT') {
            //     const { id, ...updateData } = data;

            //     if (!id) {
            //         res.writeHead(400, { 'Content-Type': 'application/json' });
            //         res.end(JSON.stringify({ error: 'ID is required for updating.' }));
            //         return;
            //     }

            //     const result = await db.collection(collectionName).replaceOne(
            //         { _id: new ObjectId(id) },
            //         updateData
            //     );

            //     res.writeHead(200, { 'Content-Type': 'application/json' });
            //     res.end(JSON.stringify(result));
            // }
        })
    }

})

//Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log("SERver is running of port 3000");

})