const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const ejs = require('ejs')
const session = require('express-session')//session
const MongoDBStore = require('connect-mongodb-session')(session);//actually we are passing a session as afunction to the MongoDBStore...
const User = require('./models/User')
var bcrypt = require('bcryptjs');


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
    saveUninitialized:false,
    store:store
}))


const checkAuthentication=(req,res,next)=>{
    if (!req.session.isAuthenticated){
        return res.redirect("/signup")
    }
    else{
        next();
    }
}


app.get('/signup', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/dashboard',checkAuthentication, (req, res) => {
    req.session.login=true;
    res.render('welcome')
})

app.post('/register',async(req,res,next)=>{
    const {username,email,password}=req.body;
    try{
        const userr=await User.findOne({email});
        if(userr){
            res.redirect("/signup");
        }
        const hasedPassword=await bcrypt.hash(password,12);//converts the password into hashed 
        const user=new User({
            username,
            email,
            password:hasedPassword
        })
        await user.save();
        req.session.personalDetails=user;
        res.redirect("/login");
    }
    catch(err){
        console.log(err);
        
        res.redirect('/signup')
    }
})


app.post("/user-login",async(req,res,next)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
       return res.redirect("/signup");
    }
    const passTrue=bcrypt.compare(password,user.password);//here it compares  the user entered password is same as the password in datbase 
    if(passTrue){
        req.session.isAuthenticated=true;
        return res.redirect("/dashboard");
    }
    res.redirect("/signup")
})

app.use("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/signup")
    })
})


app.listen(3000, () => {
    console.log(`Server started and Running @ ${PORT}`);
});