const mongoose = require('mongoose');

const connectToMongo = ()=>{
    mongoose.connect("mongodb://localhost:27017/notebookDB");   
}

module.exports = connectToMongo;