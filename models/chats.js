
const mongoose = require('mongoose')

const Chats = mongoose.model(
    'Chats',
    new mongoose.Schema(
        {
            userId : String,
            chatname : String,
        }
        ,
        { timestamps: true }
    )
);

module.exports = Chats;