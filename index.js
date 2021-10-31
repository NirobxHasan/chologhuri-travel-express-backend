const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();

const app= express();
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jiiff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("Chologhuri-travel");
      const tourPackageCollection = database.collection("tour-package");
      const placedOrderCollecttion = database.collection("placeOrder")

      //Get all package
      app.get("/services", async(req,res)=>{
        const cursor = tourPackageCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
      })
      //POST Tour package
      app.post('/services', async(req,res)=>{
        const data = req.body;
        const result = await tourPackageCollection.insertOne(data);
        res.json(result);
      })

      //Post a order
      app.post("/order",async(req,res)=>{
        const data = req.body;
        const result = await placedOrderCollecttion.insertOne(data);
        res.json(result);
      })

      //Get a single package
      app.get("/services/:id", async(req,res)=>{
          const id = req.params.id;
        
          const query = {_id:ObjectID(id)};
          console.log();
          const service = await tourPackageCollection.findOne(query);
          res.json(service);

      })
      //Get all Booking
      app.get("/allbooking", async(req,res)=>{
        const cursor = placedOrderCollecttion.find({});
        const bookings = await cursor.toArray();
        res.json(bookings);
      })

      //Get my oder
      app.get("/mybooking/:email",async(req,res)=>{
        const email = req.params.email;
        const query = {Email:email}
        const cursor = placedOrderCollecttion.find(query);
        const booking = await cursor.toArray();
        res.json(booking);
      })
      //Update Order Status

      app.put('/mybooking/:id', async(req,res)=>{
        const id = req.params.id;
        const updateStatus = req.body;
        console.log(id);
        console.log(updateStatus);
        const filter = {_id:ObjectID(id)}
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: updateStatus.status
          },
        };
        const result = await placedOrderCollecttion.updateOne(filter, updateDoc, options);
        res.json(result) 
      })


      app.delete("/mybooking/:id", async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectID(id) };
        const result = await placedOrderCollecttion.deleteOne(query);
        res.json(result);
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("I am from chologhuri!")
})

app.listen(port,()=>{
    console.log("Litsening from port ",port);
})