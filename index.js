const express = require('express');
const app = express();
const port = 4000;
const cors = require("cors");

//oKMsSNyHdEAQRblD
//sagor
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://sagor:oKMsSNyHdEAQRblD@cluster0.in0dg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{

        await client.connect();
        const notesCollection = client.db("notesTracker").collection("notes");

        // get api to read data
        //http://localhost:4000/notes
        app.get('/notes' ,async (req , res)=>{
            const q = req.query;
            // console.log(q);

            const cursor = notesCollection.find({});
            const result =await cursor.toArray()


            res.send(result);
        })


        // create ba post
        //http://localhost:4000/note

        app.post('/note' ,async (req , res)=>{

            const data = req.body;
            // console.log(data);

            const result = await notesCollection.insertOne(data);
            res.send(result);

        })


        //update
        //http://localhost:4000/note/6266fd76a60844d06d76cdee
        app.put('/note/:id' , async(req , res)=>{
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };

            const updateDoc = {
                $set: {
                  userName:data.userName ,
                  text: data.text

                },
              };

              const result = await notesCollection.updateOne(filter, updateDoc, options);
              res.send(result);

        })

        //delete
        //http://localhost:4000/note/6266fd76a60844d06d76cdee

        app.delete('/note/:id' , async(req , res )=>{

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await notesCollection.deleteOne(filter);
            res.send(result);
        })


        console.log('connected to db')


    }finally{



    }
}

run().catch(console.dir)







// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('conected to db')
//   // perform actions on the collection object
// //   client.close();
// });



app.get('/',(req , res)=>{


    res.send('hello world')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })