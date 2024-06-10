const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const JSONParser = bodyParser.json();
const server = "127.0.0.1:27017";
const db = "dummydb";
const cors = require('cors');

app.use(cors()); 

const authSchema = new mongoose.Schema({
    name:String,
    price:Number,
    status:String
});

const bookSchema = new mongoose.Schema({
    name:String,
    price:Number,
    status:String
});

const mongoConnection = mongoose.connect(`mongodb://${server}/${db}`)
.then(() => {
    console.log('Database connection successsful');
})
.catch((err) => {
    console.error('Database connection failed'+err);
});


const auth = new mongoose.model('auth', authSchema);
const book = new mongoose.model('book', bookSchema);

app.get("/", JSONParser, (req,res) => {
    res.send("Hey there, you're trying to access a dummy route, please use a /signin or /signup")
});

app.post("/signup", JSONParser, (req,res) => {
    console.log("got data::::::::");
    const newAuth = mongoose.Schema({
        name: req.body.name,
        password: req.body.password
    });
    newAuth.save()
    .then(()=> {
        console.log("Save auth data in mongodb!");
        res.send("Signup is successful!");
    })
    .catch((err) => {
        console.error(error);
    });

    res.send("The data has been received");
});

app.post("/addbook",JSONParser, async (req,res) => {
    res.send("Book added successfully!");
    const Book = mongoose.model('Book',bookSchema);
    const newBook = new Book({
        name: req.body.name,
        price: req.body.price,
        status: req.body.status
    });
    newBook.save()
    .then(()=> {
        console.log("Save auth data in mongodb!");
        res.send("Signup is successful!");
    })
    .catch((err) => {
        console.error(error);
    });

    res.send("The data has been received");
    
});

app.post("/take",JSONParser,async (req,res) => {
    console.log("in the taken route",req.body);
    const BookReturns = book.find()({
        name:req.body.name
    });
    console.log(bookReturns[0]);

    if(BookReturns[0].status == "available"){
        console.log("Book is available.");
        console.log("Trying to give the book and set status");
        book.updateOne({name:req.body.name},{status:"not available"})
        .then(
            console.log("update not done")
        )
        .catch(
            console.error(err)
        );
        res.send("This book has been alloted to you")
    }
    else{
       console.log("Book is not available");
       res.send("Book is not available");
    }
});

app.post("/delete",JSONParser,async (req,res) => {
    console.log("in the taken route",req.body);
    const BookReturns = book.find()({
        name:req.body.name
    });
    console.log(bookReturns[0]);

    if(BookReturns[0].status == "available"){
        console.log("Book is available.");
        console.log("Trying to give the book and set status");
        book.updateOne({name:req.body.name},{status:"not available"})
        .then(
            console.log("update not done")
        )
        .catch(
            console.error(err)
        );
        res.send("This book has been deleted");
    }
    else{
       console.log("Book is not available");
       res.send("Book is not available");
    }
});

app.post("/signin", JSONParser, async(req,res) => {
    console.log("got a request",req.body);
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
    const authReturns = await auth.find({
        email:reqEmail,
        password:reqPassword
    });
    console.log(authReturns);
    if(authReturns.length>0){
        console.log("Sign-in successful");
        res.send("Sign-in successfull!");
    } 
    else{
        console.log("Sign-in failed!");
        res.status(404); 
        res.send("Sign-in failed!");
    }

});

app.listen(3030,() => {
    console.log('Server is running on port 3030!');
});

