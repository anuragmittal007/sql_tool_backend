
const db = require('../models/index');
const User = db.user;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../main/config');



const home = (req, res) => {
    User.find(
        {
            _id: req.userId
        }
    ).exec().then(user => {
        res.json({
            message: 'Welcome to the SQL GENERATOR API',
            username: user[0].username,
            email: user[0].email,

        });
    }
    )
};

const test = (req, res) => {
    res.json({
        message: 'Welcome to the SQL GENERATOR API'
    });
};

const signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save();
    res.status(200).json({
        message: 'User was registered successfully'
    });
    
};

const signin = (req, res) => {
    User.find({
        username: req.body.username
    }).exec().then(user => {
        if(user.length == 0){
            return res.status(401).json({
                message: 'Not resgistered. Please signup'
            })
        }
        
        const passwordIsValid = bcrypt.compareSync(req.body.password, user[0].password);
        if(!passwordIsValid){
            return res.status(401).json({
                message: 'Invalid password'
            })
        }
        const token = jwt.sign(
            {
                id: user[0]._id
            },
            TOKEN_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token
        })
    })
    
};



module.exports = {
    home,
    signup,
    signin,
    test
};