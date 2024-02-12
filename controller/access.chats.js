const db = require('../models/index');
const Chats = db.chat;
const ChatHistory = db.chatHistory;


const getChats = (req, res) => {
    // console.log(req.userId);
    Chats.find(
        {
            userId: req.userId
        }
    ).sort(
        {
            createdAt : -1
        }
    )
    .exec().then(chats => {
        res.json({
            chats: chats
        });
    }
    )
}

const updateChats = (req, res) => {
    // console.log(req.body);
    const chatId = req.body.id;
    const chatName = req.body.name;
    // update the chat name
    Chats.findOneAndUpdate(
        {
            _id: chatId
        },
        {
            chatname: chatName
        },
        {
            new: true // This option returns the modified document rather than the original
        }
    ).exec().then(chat => {
        res.json({
            chat: chat
        });
    });
    
};

const getChatHistory = (req, res) => {
    const chatId = req.query.id;
    // console.log(req);
    // console.log(req.query);
    ChatHistory.find({ chatId: chatId }).sort({ createdAt: 1})
        .exec()
        .then(chatHistory => {
            if (chatHistory.length === 0) {
            return res.status(401).json({ message: 'No chat history found' });
            }
            // console.log(chatHistory);
            res.json({
                
                chatHistory: chatHistory
            });
        });

}

module.exports = {
    getChats,
    updateChats,
    getChatHistory
}