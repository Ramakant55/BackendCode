const { MongoClient } = require("mongodb");

// MongoDB Atlas connection URL
const url = "mongodb+srv://jangirramakant786:jsxKKquF4fiPkAPj@cluster1.dag1i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url); // No need for additional options

const dbName = "user";

async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Database Connected Successfully");

        // Access the database
        const db = client.db(dbName);
        const userCollection = db.collection("users");
        const ordersCollection=db.collection("orders");
        console.log("Inserting data in users collection");
        //add data in users collection
        // await userCollection.insertMany([
        //     { _id: 4, name: "Aryan", age: 33 },
        //     { _id: 5, name: "Mukesh", age: 35 },
        //     { _id: 6, name: "Mohit", age: 23 }
        // ])
        // await ordersCollection.insertMany([
        //     {orderid:101,userId:1,item:"Laptop",price:12000},
        //     {orderid:102,userId:3,item:"Mouse",price:1200},
        //     {orderid:103,userId:4,item:"Keyboard",price:1800}
        // ]);

        //findind all users
        //empty object -> all users
        // const allusers=await userCollection.find({}).toArray();
        // console.log(allusers)


        //findout single user->findone
        // console.log("finding one user");
        // const findOneuser=await userCollection.findOne({name:"Rama"});
        // console.log("single user found",findOneuser)

        //update the user--updateOne update

// const updateResult = await userCollection.updateOne({name:"Ram"},{$set:{age:50}});
// console.log("Updated Result",updateResult);

//delete a user--deleteOne ya MAny
// console.log("delete a user");
// const deleteUser= await userCollection.deleteOne({name:"Ram",name:"Rama"});
// console.log("User Deleted Successfully",deleteUser);

//filter method
// console.log("filter using age");
// const filteredUser =await userCollection.find({age:{$gt:25}}).toArray();
// console.log("values are found filtered user",filteredUser);

//aggregate queries
//lookup->join operations with other collection
//users->orders se conncet

//unwind method
//match method ->filter Document on some specific value
const result =await userCollection.aggregate([
    {
        $lookup:{
            from:"orders",   //target
            localField:"_id", //parent collection name
            foreignField:"userId",
            as:"orderDetails"  //want to store as a result
        }
        },{
            $unwind:{
                path:"$orderDetails",
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $match:{
                "orderDetails.price":{$gt:1500}
            }
        } ,
        {
            $group:{
                _id:"$_id",  //user collections
                countOrders:{$sum:1}, //sum of totals orders
                totalspent:{$sum:"$orderDetails.price"}  //sum of price  //order collection
            }
        }
            
    
]).toArray();
console.log(result)

        // console.log("data inserted successsfully");

        console.log(`Connected to database: ${dbName}`);
    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        // Close the connection
        await client.close();
    }
}

// Run the main function
main().catch(console.error);
