//How to create package.json file in backend
->packages - version
->aouthor
->licence
->command -npm init
->version   3.04.05
->3  ->major update (During a project you don't hav to upgrade to major update)->4.0.0
->04  ->recommended updates  ->3.05.00
->05  ->mini update ()  ->3.04.06
->package.json

//storing specific ip address-> ip module
//log the user data

->fs module in node js---
->different file operations
->Read a file ->fs.readFile
->write a file  ->
->Update a file
->Delete a file
->Creating a directory(folder)
->Reading a directory(folder)
->Deleting a directory
-> Checking if directory exists or not



//Wirit A File
//sync
// fs.writeFileSync("file.txt","Hello Ramakant");
// console.log("File Written Successfully sync method");

//Async
// fs.writeFile("file1.txt","Helloo Ram",(err)=>{
//     if(err)throw err;
//     console.log("File written successfully");
// })

//Reading A File
//Sync
// const data=fs.readFileSync("file.txt","utf8");
// console.log(data);

//Async
// fs.readFile("file.txt","utf8",(err,data)=>{
//     if(err) throw err;
//     console.log(data)
// });


//Updating A File
//Sync
// fs.appendFileSync("file.txt","Hey Guys");
// console.log("Data Added Successfully");

//Async
// fs.appendFile("file.txt","\nThis is updated file",(err)=>{
//     if(err) throw err;
//     console.log("Data Added successfully");
// })

//Delete A File
//Sync
// fs.unlinkSync("file1.txt");
// console.log("File Deleted Successfully");

//Async
// fs.unlink("file3.txt",(err)=>{
//     if(err) throw err;
//     console.log("file Deleted");
// })

//Direcorty Operation in node js FsModule

//Sync
// fs.mkdirSync("DirUsingSyncMethod");

//Async
// fs.mkdir('newDir',(err)=>{
//     if(err) throw err;
//     console.log("new directory is created");
// });

// fs.writeFileSync("newDir/Helo.txt","Hello rma");
// console.log("new file created");


//Sync
// const files=fs.readdirSync("newDir");
// console.log(files);
// console.log("Folder id readed successfully");


//Async
// fs.readdir("newDir",(err,files)=>{
//     if(err) throw err;
//     console.log(files);
// })


//Sync
// fs.rmdirSync("DirUsingSyncMethod");
// console.log("Directory using sync method is deleted");


//Async
// fs.rmdir("newDir",(err)=>{
//     if(err) throw err;
//     console.log("Directory is removed");
// })

// fs.rm('newDirectory',{recursive:true,force:true},(err)=>{
//     if(err){
//         console.error('Error:',err.message);
//     }
//     else{
//         console.log('Directory and its content removed Sucessfully');
//     }
// });


// fs.renameSync("newFolder","newDirectory");
// console.log("Dirctory name is changed");




///http method
Client ----> Server
jsonplaceholder.com/posts-->Data 1
jsonplaceholder.com/title-->Data 2
jsonplaceholder.com/result-->Data 3

Types of Http Method
1. Get Method
Purpose :- For fatching some Data
//get method me koi body nhi hoti h
->req->jo request kr rhe h wo url
->res-> response jo aa rha h wo
http.get('/posts,(req,res)=>{
    res.send('fatching all users');
})

2.Post Method
Purpose :- Server Pr New Data create krna to to
//we sent data in body
http.post('/title,(req,res)=>{
    res.send("Creating new user");
})

3.Put Method
->totally replace/change the data

4.Patch Method
->specific entry ko change krna ho to 

5.Delete Method
6.Options
7.Head Method
8.Trace Method
9.Connect Method



