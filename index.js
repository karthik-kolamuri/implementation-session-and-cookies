const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const ejs = require('ejs')
// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/User')
// var bcrypt = require('bcryptjs');


const app = express();

dotEnv.config();

const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))



mongoose.connect("mongodb+srv://karthikkolamur:Ka45h8k@udemyyy.l1ady.mongodb.net/shop?retryWrites=true&w=majority&appName=Udemyyy")
    .then(() => {
        console.log("MongoDB Connected Succesfully!");
    })
    .catch((error) => {
        console.log(`${error}`);
    });




app.get('/signup', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/dashboard', (req, res) => {
    res.render('welcome')
})

app.listen(3000, () => {
    console.log(`Server started and Running @ ${PORT}`);
});