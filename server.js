
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://collins:Test123@cluster0.mfxs3.mongodb.net/kefisDB",{useNewUrlParser:true,useUnifiedTopology:true});

const productschema = {
  ProductDetail:String,QuantityPurchase:Number,Price:Number,
  ReoderLevel:Number,ReorderQuantity:Number
};

const Product = mongoose.model("product",productschema);

const cheese = new Product({
  ProductDetail:"MILK",Price:100,
  ReoderLevel:25,ReorderQuantity:100
});

const bread = new Product({
  ProductDetail:"COOKING OIL",Price:200,
  ReoderLevel:50,ReorderQuantity:50
});

const brush = new Product({
  ProductDetail:"WATER",Price:200,
  ReoderLevel:50,ReorderQuantity:50
});

const tomatoes = new Product({
  ProductDetail:"RICE",Price:150,
  ReoderLevel:50,ReorderQuantity:50
});

const onions = new Product({
  ProductDetail:"MEAT",Price:300,
  ReoderLevel:50,ReorderQuantity:50
});

const defaultItems = [cheese,bread,brush,tomatoes,onions];




app.get("/",function(req,res){

Product.find({},function(err,result){

  if(result.length===0){
    Product.insertMany(defaultItems,function(err){
      if(err){
        console.log(err)
      }else
      console.log("You have successfully inserted the products")
    });
    res.redirect("/")
  }else{
    res.render("kefis.ejs",{result:result})
    }
});

})

app.get("/warehouse",function(req,res){

Product.find({},function(err,result){
    res.render("warehouse.ejs",{result:result})
});

});


app.get("/pending",function(req,res){
  Product.find({ReoderLevel:"10"},function(err,result){
      res.render("pending.ejs",{result:result})
      console.log(result)
  });
});


app.get("/processed",function(req,res){
  Product.find({ReoderLevel:"100"},function(err,result){
      res.render("processed.ejs",{result:result})
  });
});



app.post("/",function(req,res){
  // Find all documents matching the
// condition and update all
// This function has 4 parameters i.e.
// filter, update, options, callback

Product.updateMany({ReoderLevel:{$gte:49}},
    {ReoderLevel:"10"}, function (err, prices) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated prices : ", prices);
    }res.redirect("/");
});
});

app.post("/incrementor",function(req,res){
  // Find all documents matching the
// condition and update all
// This function has 4 parameters i.e.
// filter, update, options, callback
Product.updateMany({ReoderLevel:{$lte:49}},
    {ReoderLevel:"100"}, function (err, reorder) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated prices : ", reorder);
    }res.redirect("/warehouse");
});
});
app.listen(3000,function(){
});
