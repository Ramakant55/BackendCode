// server create -> htttp module
const http = require('http');
// const { MongoClient, ObjectId } = require('mongodb');
const {MongoClient,ObjectId}=require('mongodb');
// Uri for connection
const uri="mongodb://127.0.0.1:27017";
const dbName="RamDb"
const collectionName="testCollection"
// connect to mongodb
let db;
MongoClient.connect(uri,{useUnifiedTopology:true}).then((client)=>{
    console.log("Connected Successfully");
    db=client.db(dbName);
}).catch((err)=>console.error("Failed to Connect with mongodb",err));
// create http server
const server = http.createServer(async(req,res)=>{
    const {method,url}=req;
    if(url.startsWith('/data')){
        let body='';
        req.on('data',(chunk)=>{
            body +=chunk.toString();
        })
        req.on('end',async ()=>{
            const data = body ? JSON.parse(body) : {};
            // 1. Get Method
            if(method==='GET'){
               const documents = await db.collection(collectionName).find().toArray();
               res.writeHead(200,{'Content-Type':'application/json'});
               res.end(JSON.stringify(documents));
            }
            // Post Method
            else if(method === 'POST'){
                // Insert the data 
                // 1. InsertOne 2. InsertMany
                const result = await db.collection(collectionName).insertOne(data);
                res.writeHead(201,{'Content-Type':'application/json'});
                res.end(JSON.stringify({insertId:result.insertId,...data}));
            }
        })
    }
})

// start the server

const PORT = 3000;
server.listen(PORT,()=>{
    console.log("Server is running of port 3000");
})