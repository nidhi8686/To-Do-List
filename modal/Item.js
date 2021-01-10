
const mongoose = require('mongoose');

const itemsSchema=new mongoose.Schema({
    name:{
        type : String,
        required : true
    }
})

const thisSchema=mongoose.model('Item',itemsSchema);

module.exports={
    itemsSchema:itemsSchema,
    thisSchema:thisSchema
}
