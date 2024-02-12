
const express = require("express");
const { home, signup, signin, test } = require("../controller/auth");
const { generateQuery } = require("../controller/query.generate.js");
const { executeQuery } = require("../controller/query.execute.js");
const {getChats, updateChats, getChatHistory } = require("../controller/access.chats.js");
const getSchema = require("../controller/schema.extract");
const verifySignup = require("../middlewares/verifySignup.js");
const verifyToken = require("../middlewares/jwtAuth.js");

const uploadController = require('../controller/upload');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const router = require("express").Router();




router.get("/",verifyToken, home);
router.post("/signup",verifySignup, signup);
router.post("/signin", signin);
router.get("/test", test);
router.post('/upload', verifyToken,upload.single('file'), uploadController.uploadFile);
router.get("/design", verifyToken, getSchema);
router.post("/getquery", verifyToken, generateQuery);
router.get("/chats", verifyToken, getChats);
router.post("/editchatname", verifyToken, updateChats);
router.get("/getchathistory", verifyToken, getChatHistory);
router.post("/executequery", verifyToken, executeQuery);


module.exports = router;
