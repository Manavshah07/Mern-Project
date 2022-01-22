const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            },
        }
    ],
    tokens:[
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})


// we are hashing the password here
userSchema.pre('save', async function(next) {
    console.log("inisde here");
    if(this.isModified('password')) { 
        //isModified matlab koi mere database ke data ko change kre tab ye call hoga eg:password
        this.password = await bcrypt.hash(this.password, 12); // ya user ka password h vo hasg hoke pehle this.password me store hogaya h
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next(); 
})

// we are generating token 
userSchema.methods.generateAuthToken = async function() {
    try { 
        // Here sign() has 3 args first is payload: it should be unique and db me unique id h, second is secret or private key: , 3rd is [options, callback] 
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token:token })
        await this.save();
        return token;
        
    } catch (error) {
        console.log(error);
    }
}

// stored the message
userSchema.methods.addMessage = async function(name, email, phone, message) {
    try {
        this.messages = this.messages.concat({name, email, phone, message});
        await this.save();
        return this.messages;

    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('USER', userSchema);

module.exports = User;