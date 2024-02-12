const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('mongoose')
const url = "mongodb+srv://danielbaiman:tb2XWIo5nJBqgZb4@cluster0.p8xy3.mongodb.net/svshop"

db.connect(url).then(()=>{console.log("DB is on.")}).catch((err)=>{
    console.log(err);
});

app.use (express.static("public"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const productSchema = new db.Schema({
    productName: String,
    price:Number
})
const productModel = db.model("product",productSchema)

// app.get('/add',(req,res)=>{
//     let products = [{
//         productName: 'Kiwi',
//         price: 17,
//     },
//     {
//         productName: 'Nectarine',
//         price: 23,
//     },
//     {
//         productName: 'Apple',
//         price: 10,
//     },
//     {
//         productName: 'Banana',
//         price: 7,
//     },
//     {
//         productName: 'Clementine',
//         price: 7,
//     },
//     {
//         productName: 'Orange',
//         price: 6,
//     },
//     {
//         productName: 'Grapefruit',
//         price: 6,
//     },
//     {
//         productName: 'Pomegranate',
//         price: 10,
//     },
//     {
//         productName: 'Strawberry',
//         price: 19,
//     },
//     {
//         productName: 'Avocado',
//         price: 5,
//     },
// ]
//     const add =async()=>{
//         await productModel.insertMany(products);
//         res.send('products are added');
//     }
//     add();
// })



const userSchema = new db.Schema({
    name: String,
    email:String,
    password:String
})
const userModel = db.model("user",userSchema)

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/public/signin.html")
})

app.get("/signin",async(req,res)=>{
    const result = await userModel.find();
    res.send(result)
})

app.post('/signup',async (req,res)=>{
    let temp = {
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
    }
    console.log(temp)
    const result = await userModel.findOne(
        {email: temp.email}
    );
    if(result != null){
        res.status(400).json({message:"allredy signedup"})
    }else if(temp.email == '' || temp.name == '' || temp.password == ''){
        res.status(400).json({message:"enter all inputs"})
    }else{
        await userModel.insertMany(temp)
        res.status(200).send({message: 'signedup'})
    }
})

app.get('/products', async(req,res)=>{
    const result = await productModel.find();
    res.send(result)
})

const orderSchema = new db.Schema({
    name: String,
    products:Object
})
const orderModel = db.model("order",orderSchema)


app.post('/buy',async (req,res)=>{
    let temp = {
        name: req.body.name,
        products: req.body.products,
    }
    if(temp.products!=''){
        console.log(temp)
        await orderModel.insertMany(temp)
        res.status(200).send({message: 'approved'})
    }else{
        res.status(200).send({message: 'no products selected'})
    }
    
})

app.get('/all',permission, async(req,res)=>{
    const result = await orderModel.find();
    res.send(result)
})
function permission(req,res,next){
    if(req.query.admin == 'true')
        next();
    else{
        res.status(400).send('error');
    }
}

app.listen(3000,()=>{
    console.log("server works on port 3000")
})