const jwt = require('jsonwebtoken'); 


const generateAcessToken = (user) => {
    return jwt.sign(
        {userId},
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    );
} 

const generateToken = () => {
    return  Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports = {generateAcessToken, generateToken};  

