
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});




module.exports = {
    port : process.env.PORT || 4000,
    TOKEN_SECRET : process.env.TOKEN_SECRET
};