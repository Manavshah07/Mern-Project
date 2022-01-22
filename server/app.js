const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();

// yaha mene config file me mera database ka password store kiya h usko sirf bulaya idr 
// aur mene config.env ko gitignore me b include kiya kyuki kal agar me github pe daalu to vo config.env ko upload na kaare taaki koi mera password na dekh saake
dotenv.config({path: './config.env'});

require("./db/conn");
// const User = require("./model/userSchema");


app.use(cookieParser());
// yaha middleware ke throughjo b data aa rha json me vo bas dikhado 
app.use(express.json());


// router files ko link kiya h yaha
app.use(require("./router/auth"));

const PORT = process.env.PORT;



// Yaha middleware matlab me about me pe jaa rha hu but me login nhi hu to vo mujhe sidha login pe bhejra h. to middleware ke help se dekhra hu ki user authenticate h ki nhi vo genuine h ki nhi agar nhi h to login page bata to yaha pe middleware kaam kr rha h  

// Middleware
// jab ye middleware ka kaam hojayega tab next matlab (next kaam shuru karo) ruko mat
// Middleware functions are functions that have access to the request object(req), the response object (res), and the next function in the application's request-response cycle
// The next function is a function in the Express Router which, when invoked, executes the middleware succeeding the current middleware.

// const middleware = (req, res, next) => {
//     console.log(`Hello my middleware`);
//     next(); // agar user login hojaata h to me next ko call krdunga 
// }

// const middleware = (req, res, next) => {
//     console.log(`Hello its another middleware`);
// }

// get method contains (path, callback func) path means kaha jaana h & callback matlab kaisa jaana h
// in callback func we send thwo things req and res. res means i have to send some response from my server that if anyone visits ny website than what to show

// app.get('/', (req, res) => {
//     res.send(`Hello world from the server`);
// });

// app.get('/about', middleware, (req, res) => {
//     console.log(`Hello my about`); // iske pehle middleware chalta h phir about chalega
//     res.send(`Hello About Me from the server`);
// });

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})

