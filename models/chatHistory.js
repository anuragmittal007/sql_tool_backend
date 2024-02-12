
const mongoose = require('mongoose')

const ChatsHistory = mongoose.model(
    'ChatsHistory',
    new mongoose.Schema(
        {
            chatId : String,
            message : String,
            role : String,
        },
        { timestamps: true }  
    )
);

module.exports = ChatsHistory;