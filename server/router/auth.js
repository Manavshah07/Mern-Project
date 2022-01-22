const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../model/userSchema");

router.get('/', (req, res) => {
    res.send(`Hello world from the server route.js`);
});

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({error: "Plz filled the field Properly" });
    }

    try {
        const emailExist = await User.findOne({email: email});
        if(emailExist) {
            return res.status(422).json({error: "Email already Exist" });
        }
        const phoneExist = await User.findOne({phone: phone});
        if(phoneExist) {
            return res.status(422).json({error: "Phone no already Exist" });
        }


        const user = new User({ name, email, phone, work, password, cpassword });
        // yahape mera data datababase me jaaneke pehle mujhe password & cpassword ko hash krna hoga & hash ke baad hum data save krenge... So ye User ke baad & save ke pehle to ye middleware ban rh h dono ke bichme
        await user.save();
        res.status(201).json({message: "User Registered Successfully"});


        // if(userRegister) {
        //     res.status(201).json({message: "User Registered Successfully"});
        // } else {
        //     res.status(500).json({error: "failed registered"});
        // }


    } catch (error) {
        console.log(error);
    }
})


// login route
router.post('/signin', async (req, res) => {
    // console.log(req.body);
    // res.json({message: "awesome"});

    try {
        let token;
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({error: "Plz filled the data" });
        }

        const userLogin = await User.findOne({email: email});
        // console.log(userLogin); // yaha email jo h vo databse vaala email se match hogaya to findOne pure document ko batata h

        if(userLogin) {
            // yaha hum check kr rahe h ki user jo password daalra h & Database me jo password h vo same h ki nhi
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            // cookie takes 2 parameter pehla name: cookie ka name ky h, dusra cookie ka value ky h
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000), // jiss din user login krgefa uske baad 30 din tak vo login ho skata h uske baad cookie expire hoga
                httpOnly: true
            });

            if(isMatch) {
                res.json({Message: "User Signin Successful"});
            } else {
                res.status(400).json({Error: "Invalid Credentails"});
            }

        } else {
            res.status(400).json({Error: "Invalid Credentails"});
        }

    } catch (error) {
        console.log(error);
    }
});

// ABOUT US KA PAGE
router.get('/about', authenticate, (req, res) => {
    console.log(`Hello my about`); // iske pehle middleware chalta h phir about chalega
    res.send(req.rootUser);
    res.send("This is about page");
    console.log(req.rootUser);
});

// get user data for contact & Home
router.get('/getData', authenticate, (req, res) => {
    console.log(`Hello my about`); // iske pehle middleware chalta h phir about chalega
    res.send(req.rootUser);
    res.send("This is about page");
    console.log(req.rootUser);
})

// contact us page
router.post('/contact', authenticate, async (req, res) => {
    try {

        const {name, email, phone, message} = req.body;

        if(!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({error: "plz filled the contact form"});
        }

        // JO user login h usko hi mera message me jo likhunga vo jaana chaiye
        const userContact = await User.findOne({ _id: req.userID });
        if(userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({message: "Message sent successfully"});
        }

    } catch (error) {
        console.log(error);
    }
});

// LOGOUT KA PAGE
router.get('/logout', (req, res) => {
    console.log(`Hello my logout page`); // iske pehle middleware chalta h phir about chalega
    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send(`User Logout`);
});

module.exports = router;
