
const app = require('./app');

const db = require('../models/index');

const { port } = require('./config');

app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log(`Server is running on port ${port}`);
})
