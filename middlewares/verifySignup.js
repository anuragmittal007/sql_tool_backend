
const mongoose = require("mongoose");
const db = require("../models");
const User = db.user;

const verifySignup = async (req, res, next) => {
    try {
        const existingUsername = await User.findOne({ username: req.body.username });
        const existingEmail = await User.findOne({ email: req.body.email });

        if (existingUsername) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // If neither username nor email exists, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in verifySignup middleware:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = verifySignup;
