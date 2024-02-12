
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/query_generator')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    console.log('connected to database')
});

db.user = require('./users')
db.chat = require('./chats')
db.chatHistory = require('./chatHistory')
// db.note = require('./model.notes.js')


module.exports = db;