const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const ejs = require('ejs')
const session = require('express-session')//session
const MongoDBStore = require('connect-mongodb-session')(session);//actually we are passing a session as afunction to the MongoDBStore...
const User = require('./models/User')
// var bcrypt = require('bcryptjs');


const app = express();

dotEnv.config();

const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))


mongoose.connect("mongodb+srv://karthikkolamur:Ka45h8k@udemyyy.l1ady.mongodb.net/session?retryWrites=true&w=majority&appName=Udemyyy")
    .then(() => {
        console.log("MongoDB Connected Succesfully!");
    })
    .catch((error) => {
        console.log(`${error}`);
    });

    //creating a collection in the mongoDb 
    const store=new MongoDBStore({
        uri:"mongodb+srv://karthikkolamur:Ka45h8k@udemyyy.l1ady.mongodb.net/mysession?retryWrites=true&w=majority&appName=Udemyyy",
        collection:"mysession2"

    })


    // creating a cookkie 
app.use(session({
    secret:"This is Karthik..",
    resave:false,
    saveUninitialized:true,
    store:store
}))


app.get('/signup', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/dashboard', (req, res) => {
    res.render('welcome')
})

app.post('/register',async(req,res,next)=>{
    const {username,email,password}=req.body;
    try{
        const user=new User({
            username,
            email,
            password
        })
        await user.save();
        req.session.userDetails=user;
        res.redirect('/login');
    }
    catch(err){
        res.redirect('/signup')
    }
})

app.listen(3000, () => {
    console.log(`Server started and Running @ ${PORT}`);
});