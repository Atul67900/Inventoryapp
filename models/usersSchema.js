const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    pname:{
        type:String,
        required:true,
        trime:true
    },
    pcode:{
        type:String,
        required:true,
        unique:true
    },
    pquantity:{
        type:String,
        required:true,
        trime:true,
        minlength:1,
        maxlength:1000
    },
    status:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        required:true,
    },
    datecreated:Date,
    dateUpdated:Date
});

//model

const products = new mongoose.model("products",usersSchema)

module.exports = products;