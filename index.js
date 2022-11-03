const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');

// middle ware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=> {
    res.send('Ema jhon server is running')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cn0mdvb.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run () {
    
    try{
        const productCollection = client.db("emajhon").collection("products");
        
        app.get('/products', async(req, res)=> {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size)
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({count, products})
        })  

        app.post('/productsByIds', async(req, res)=> {
            const ids = req.body;
            // console.log(ids)
            const ObjectIds = ids.map(id => ObjectId(id))
            const query = {_id: {$in: ObjectIds}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        }) 

    }
    catch{(error)=> {
        console.log(error)
    }}

}

run().catch((error)=> console.log(error))







app.listen(port, ()=> {
    console.log(`server is connected ${port}`)
})

