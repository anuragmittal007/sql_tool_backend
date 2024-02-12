
const db = require('../models/index');
const ChatHistory = db.chatHistory;
const Chats = db.chat;
const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');



const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey : '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',
    model: 'ft:gpt-3.5-turbo-0613:personal::8pxBjhMM',
});

async function main(prompt) {
    const completion = await openai.chat.completions.create({
        messages: [
                    {
                        role: "system",
                        content: "You are SQL BOT."
                    },
                    { 
                        role: "user", 
                        content: prompt
                    }
        ],
        model: "ft:gpt-3.5-turbo-0613:personal::8pxBjhMM",
    });

    return completion.choices[0];
}
function extractFirstSqlQuery(message) {
    // Regular expression to match a basic SQL query structure
    const sqlQueryRegex = /SELECT\b[\s\S]*?;/i;
    const matches = message.match(sqlQueryRegex);
    
    // If there's a match, return the first SQL query found
    return matches ? matches[0] : null;
}




const generateQuery = (req, res) => {
    // console.log(req.query.id);
    const myPrompt = req.body.message; 
    const chatId = req.query.id;
    // console.log(req.body);

    chatHistory = new ChatHistory({
        chatId: chatId,
        message: myPrompt,
        role : 'user'
    });
    chatHistory.save();

    ChatHistory.find({ chatId: chatId }).sort({ createdAt: 1})
        .exec()
        .then(chatHistory => {
            if (chatHistory.length === 0) {
            return res.status(401).json({ message: 'No chat history found' });
            }
            // console.log(chatHistory[0].message);
            let prompt = '';
            // for (var i = 0; i < chatHistory.length; i++) {
            //     // console.log(chatHistory[i].message);
            //     prompt = prompt + '\n' + chatHistory[i].role+ ':' + chatHistory[i].message + '\n';
            // }
            prompt = chatHistory[0].message + '\n' + myPrompt;


            // console.log(prompt);

            prompt = 'use this schema to generate the query\n' + prompt + '\n';

            main(prompt).then(result => {
                const responseMessage =result.message.content;
                // console.log(responseMessage);
                query = extractFirstSqlQuery(responseMessage);
                console.log('query is :',query);

                // Chats.find({ _id: chatId }).exec().then(chat => {
                //     let user_id = chat[0].userId; // Assuming 'chat' contains the user ID you're looking for
                //     if (query) {
                //         executeQuery(user_id, query)
                //     .then(rows => console.log(rows))
                //     .catch(error => console.error(error));
                //     }
                //     else {
                //         console.log('No SQL query found');
                //     }
                // }).catch(error => {
                //     console.error('Error fetching chat:', error);
                // });
                

                

                
                // console.log('query result is :',queryResult);
                    


                res.json({ message: responseMessage });
                db.chatHistory = new ChatHistory({
                    chatId: chatId,
                    message: responseMessage,
                    role : 'system'
                });
                db.chatHistory.save();
                // Handle the result as needed
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error as needed
            });

        })
        .catch(error => {
            console.error('Error fetching chat history:', error);
            return res.status(500).json({ message: 'Internal server error' });
        });

};

module.exports = {
    generateQuery
};



