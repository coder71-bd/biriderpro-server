require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

//initialize express
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//connetion URI of mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcmtb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//create a new mongo client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect(); // connect to mongodb.

    const database = client.db('bikeriderpro'); //NAME OF THE DATABASE

    // COLLECTIONS UNDER DATABASE
    const bikesCollection = database.collection('bikes');
    const ordersCollection = database.collection('orders');
    const reviewsCollection = database.collection('reviews');
    const usersCollection = database.collection('users');

    /** -----------------READ----------------- **/

    // (READ) --> GET ALL BIKES FROM DATABASE
    app.get('/bikes', async (req, res) => {
      const query = {}; // find all bikes

      //find in bikes collection
      const cursor = bikesCollection.find(query);
      const bikes = await cursor.toArray();

      res.json(bikes); // send the bikes to client side.
    });

    // (READ) --> GET A SINGLE BIKE INFO FROM DATABASE
    app.get('/bikes/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) }; // query for single bike

      const bike = await bikesCollection.findOne(query); // find the single bike

      res.json(bike); // send the bike to client side.
    });

    // (READ) --> GET ALL THE REVIEW
    app.get('/reviews', async (req, res) => {
      const query = {}; // find all reviews

      //find in reviews collection
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();

      res.json(reviews); // send the reviews to client side.
    });

    // (READ) --> GET ALL THE ORDER INFO OR SPECIFIQ ORDER INFO VIA QUERYING
    app.get('/orders', async (req, res) => {
      let query = {}; // find all orders

      if (req.query?.email) {
        const email = req.query.email;
        query = { email }; // find the specific user order
      }

      //find in order collection
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();

      res.json(orders); // send the orders to client side.
    });

    // (READ) --> GET A SPECIFIC USER INFO FROM DATABASE
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;

      const query = { email };

      const user = await usersCollection.findOne(query);

      let isAdmin = user?.role === 'admin';

      res.json({ admin: isAdmin }); // send the admin status of user to client side
    });

    /** -----------------CREATE----------------- **/

    //  (CREATE) --> CREATE A BIKE PRODUCT IN DATABASE
    app.post('/bikes', async (req, res) => {
      const newBike = req.body; // bike product info

      const result = await bikesCollection.insertOne(newBike);

      res.json(result); // response after adding bike product in the database
    });

    //  (CREATE) --> CREATE AN USER REVIEW IN DATABASE
    app.post('/reviews', async (req, res) => {
      const userReviews = req.body; // user review info

      const result = await reviewsCollection.insertOne(userReviews);

      res.json(result); // response after adding bike user review in the database
    });

    // (CREATE) --> CREATE AN ORDER INFO IN DATABASE
    app.post('/orders', async (req, res) => {
      const newOrder = req.body; // order info

      // insert the order info in order collection
      const result = await ordersCollection.insertOne({
        ...newOrder,
        status: 'pending',
      });

      res.json(result); // response after adding order info in the database
    });

    /** -----------------UPDATE----------------- **/

    //(UPDATE) --> UPDATE THE ORDER STATUS
    app.put('/order/:id', async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };

      const options = { upsert: true };

      // update the order status
      const updateOrder = {
        $set: {
          status: 'shipped',
        },
      };

      const result = await ordersCollection.updateOne(
        filter,
        updateOrder,
        options
      );

      res.json(result); // send the response to client
    });

    //(UPDATE) --> UPDATE AN USER
    app.put('/users', async (req, res) => {
      const user = req.body;

      const filter = { email: user.email };

      const options = { upsert: true };

      const updateDoc = { $set: user };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.json(result); // send the respone to client side
    });

    app.put('/users/admin', async (req, res) => {
      const user = req.body;

      if (user?.requester) {
        const requesterAccount = await usersCollection.findOne({
          email: user.requester,
        }); // find the requester info in database

        // check if the requester is admin or not
        if (requesterAccount?.role === 'admin') {
          const filter = { email: user.newAdminEmail };

          const updateDoc = { $set: { role: 'admin' } };

          const result = await usersCollection.updateOne(filter, updateDoc);

          res.json(result); // send the result after updating an user role
        } else {
          res
            .status(403)
            .json({ message: 'you do not have access to make admin' });
        }
      } else {
        res.status(404).json({ message: "can't found requester admin email" });
      }
    });

    /** -----------------DELETE----------------- **/

    // (DELETE) --> DELETE A BIKE FROM THE DATABASE
    app.delete('/bikes/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await bikesCollection.deleteOne(query); // delete the matched bike from database

      res.json(result); // send the response to client side
    });

    // (DELETE) --> DELETE AN ORDER FROM THE DATABASE
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await ordersCollection.deleteOne(query); // delete the matched order from database

      res.json(result); // send the response to user
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from BIKERIDERPRO');
});

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
