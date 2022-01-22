const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken; // yaha jab user login hota h to token jo generate hota h usko get kiya
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY); // yaha jo token get kiya & jo mera config me secret_key me h usko compare kiya h yaha
        
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token }); // yaha hum findOne ke help se check kr rahe h ki jo DB me id h & jo verifyToken ke isse id milega vo same h ki nhi aur jo mere database me tokens ke aandaar token h & jo me token get kr rha hu vo same h ki nhi. Agar ye dono match hua to user genuine h

        if(!rootUser) {
            throw new Error('User not Found');
        }

        // yaha me token get kr rha hu ki me about me easily data dikha saaku & rootUser ke paas mera pura data aajaayega
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    
    } catch (error) {
        res.status(401).send('Unauthorized: No token provided');
        console.log(error);
    }
}

module.exports = authenticate;