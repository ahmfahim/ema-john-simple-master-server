const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json());



//connection to mongoDB server
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b99uy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    
    // post product
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount)
        }) 
    })

    // get products or read products
    app.get('/products', (req, res)=>{
        productsCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })

    // get  single products or read products
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res)=>{
        const productsKeys = req.body;
        productsCollection.find({key: {$in: productsKeys}})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })

    // Orders post 
    app.post('/addOrder', (req, res) => {
        const orders = req.body;
        console.log(orders);
        ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    // --------
});


app.get('/', (req, res) => {
    res.send('done!')
})

app.listen(process.env.PORT || port);