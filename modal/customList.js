const mongoose=require('mongoose');

const itemsSchema=require('./Item').itemsSchema;

const ListSchema=new mongoose.Schema({
    name:String,
    items : [itemsSchema]
})

const thisSchema=mongoose.model('List',ListSchema);

module.exports=thisSchema;