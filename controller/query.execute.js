

const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
const { user } = require('../models');


const executeQuery = (req , res) => {
    user_id = req.userId;
    const filename = user_id + '.db';
    console.log('filename is :',filename);
    const controllerPath = __dirname;
    const projectRoot = path.resolve(controllerPath, '..'); // Navigate up one level
    const filePath = path.resolve(projectRoot, 'main', 'uploads', filename);
    const db = new sqlite3.Database(filePath, sqlite3.OPEN_READONLY);
    query = req.body.query;
    console.log('query is :',query);
    if (!query){
        res.status(400).json({message: 'Query is required'});
    }

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({message: 'Error executing query'});
        } else {
            res.status(200).json({rows});
        }
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing database file:', err.message);
        }
    });

}

module.exports = {
    executeQuery
}