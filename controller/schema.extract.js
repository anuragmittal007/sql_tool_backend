const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
const db = require('../models/index');
const Chats = db.chat;
const ChatHistory = db.chatHistory;

const getSchema = (req, res) => {
    const filename = req.userId + '.db';

    const controllerPath = __dirname;
    const projectRoot = path.resolve(controllerPath, '..'); // Navigate up one level

    const filePath = path.resolve(projectRoot, 'main', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }

    const db = new sqlite3.Database(filePath, sqlite3.OPEN_READONLY);

    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('Error retrieving tables:', err.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const schema = {};

        // Use a Promise to ensure completion of table information retrieval
        const promises = tables.map((table) => {
            const tableName = table.name;
            return new Promise((resolve, reject) => {
                db.all(`PRAGMA table_info("${tableName}")`, (err, columns) => {
                    if (err) {
                        console.error(`Error retrieving columns for table ${tableName}:`, err.message);
                        reject(err);
                    }

                    schema[tableName] = columns.map((column) => column.name);

                    resolve();
                });
            });
        });

        
        console.log(schema);
        // Wait for all promises to resolve before sending the response
        Promise.all(promises)
            .then(() => {
                // res.json({ schema });
                var savedChatId;
                chat = new Chats({
                    userId: req.userId,
                    chatname: 'New chat',
                });
            
                chat.save()
                    .then(savedChat => {
                        // Access the _id property of the saved model
                        savedChatId = savedChat._id.toString();
                        // console.log('Chat saved successfully with _id:', savedChatId);
                        const schemaString = 'The schema of database is:\n' + Object.entries(schema)
                    .map(([tableName, columns]) => `${tableName} : ${columns.join(',')}`)
                    .join('\n');
                    // schemaString = 'The schema of database is:\n\n' + schemaString;
                    // console.log(schemaString);
                    // res.json({ schemaString });
                    // console.log(savedChatId);

                    db.chatHistory = new ChatHistory({
                        chatId: savedChatId,
                        message: schemaString,
                        role : 'system'
                    });
                    db.chatHistory.save();
                    res.json({ schemaString : schemaString,
                        chatId: savedChatId
                    });
                    })
                    .catch(error => {
                        console.error('Error saving chat:', error);
                    });
                // console.log(schema);
                // const schemaString = 'The schema of database is:\n' + Object.entries(schema)
                //     .map(([tableName, columns]) => `${tableName} : ${columns.join(',')}`)
                //     .join('\n');
                // schemaString = 'The schema of database is:\n\n' + schemaString;
                // console.log(schemaString);
            })
            .catch((error) => {
                console.error('Error during schema extraction:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            })
            .finally(() => {
                // Close the database connection
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    }
                });
            });
    });
};

module.exports = getSchema;
