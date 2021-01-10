const express=require('express');
const bodyparser=require('body-parser');
const date=require(__dirname+"/date.js");
const app=express();   
const mongoose=require('mongoose');
const _ =require('lodash');


app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static('public'));
app.set("view engine","ejs");

//configure database
const db = require('./db/db').mongoURL;
mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false })
.then(()=>{
    console.log("Database Connected");
})
.catch((error)=>{
    console.log(error);
})

//creating Item collection
const Item=require('./modal/Item').thisSchema;
const item1=new Item({
    name:'Welcome to your TODO List!'
});
const item2=new Item({
    name:'Hit the + button to add a new item.'
});
const item3=new Item({
    name:'<-- Hit this to delete an item.'
});
var DefaultItems=[item1,item2,item3];

//Creating custom collection
const List=require('./modal/customList');

app.get('/',(req,res)=>{
    const day=date.getDate();
    Item.find((err,result)=>{
        if(err) throw err;
        if(result.length===0)
        {
            Item.insertMany(DefaultItems,(err)=>{
                if(err) throw err;
            });
            res.redirect('/');
        }
        else
        {
            res.render('index',{List_type : day,newListItems:result});
        }
        
    })
    
})

app.get('/:customListName',(req,res)=>{
   const customListName = _.capitalize(req.params.customListName);
   List.findOne({name:customListName},(err,foundedList)=>{
       if(err) throw err;
       
       if(!foundedList)
       {
        const list=new List({
            name:customListName,
            items :DefaultItems
        })
        list.save();
        res.redirect('/'+customListName);
        
       }
       else
       {
        res.render('index',{List_type : customListName,newListItems:foundedList.items});
       }
   })
})

app.post('/',(req,res)=>{
    const newItem=req.body.newItem;
    const listType=req.body.list;
    const addItem=new Item({
        name:newItem
    })
    if(listType === date.getDate())
    {
        addItem.save();
        res.redirect('/');
    }
    else
    {
        List.findOne({name:listType},(err,foundList)=>{
        foundList.items.push(addItem);
            foundList.save();
            res.redirect('/'+listType);
        })
    }
    
   
    
})
app.post('/delete',(req,res)=>{
    var checkedbox=req.body.checkbox;
    var listName=req.body.listName;

    if(listName === date.getDate())
    {
        Item.findByIdAndRemove(checkedbox,(err)=>{
        if(err) throw err;
        res.redirect('/');
        });
    }
    else
    {
        List.findOneAndUpdate({name:listName},{$pull : { items :{_id : checkedbox }}},(err,foundList)=>{
            if(err) throw err;
            res.redirect('/'+listName);
        })
    }

    
})
app.post('/newList',(req,res)=>{
    var list=req.body.new_list;
    res.redirect('/'+list);
})

const PORT= process.env.PORT || 3000;
app.listen(PORT,console.log(`server is running at ${PORT}`));
