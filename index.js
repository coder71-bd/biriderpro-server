require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const Bike = require('./models/Bike/Bike');
const Order = require('./models/Order/Order');
const Review = require('./models/Review/Review');
const User = require('./models/Review/Review');

//initialize express
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//connetion URI of mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcmtb.mongodb.net/biriderpro?retryWrites=true&w=majority`;

// connect to mongodb database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    /** -----------------READ----------------- **/
    // (READ) --> GET ALL BIKES FROM DATABASE
    app.get('/bikes', async (req, res) => {
      const query = {}; // find all bikes
      const bikes = await Bike.find();
      res.json(bikes); // send the bikes to client side.
    });
    // (READ) --> GET A SINGLE BIKE INFO FROM DATABASE
    app.get('/bikes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }; // query for single bike
      const bike = await Bike.findOne(query); // find the single bike
      res.json(bike); // send the bike to client side.
    });
    // (READ) --> GET ALL THE REVIEW
    app.get('/reviews', async (req, res) => {
      const query = {}; // find all reviews
      //find in reviews collection
      const reviews = await Review.find(query);
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
      const orders = await Order.find(query);
      res.json(orders); // send the orders to client side.
    });

    // (READ) --> GET A SPECIFIC USER INFO FROM DATABASE
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await User.findOne(query);
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
      const result = await Bike.insertOne(userReviews);
      res.json(result); // response after adding bike user review in the database
    });
    // (CREATE) --> CREATE AN ORDER INFO IN DATABASE
    app.post('/orders', async (req, res) => {
      const newOrder = req.body; // order info
      // insert the order info in order collection
      const result = await Order.insertMany({
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
      const result = await Order.updateOne(filter, updateOrder, options);
      res.json(result); // send the response to client
    });
    //(UPDATE) --> UPDATE AN USER
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await User.updateOne(filter, updateDoc, options);
      res.json(result); // send the respone to client side
    });
    //(UPDATE) --> UPDATE THE USER ROLE
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
          const result = await User.updateOne(filter, updateDoc);
          res.json(result); // send the result after updating an user role
        } else {
          res
            .status(403)
            .json({ message: 'you do not have access to make admin' });
        }
      } else {
        res.status(404).json({
          message:
            'Please make sure the user that you want to make admin is available in database.',
        });
      }
    });
    /** -----------------DELETE----------------- **/
    // (DELETE) --> DELETE A BIKE FROM THE DATABASE
    app.delete('/bikes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Bike.deleteOne(query); // delete the matched bike from database
      res.json(result); // send the response to client side
    });
    // (DELETE) --> DELETE AN ORDER FROM THE DATABASE
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Order.deleteOne(query); // delete the matched order from database
      res.json(result); // send the response to user
    });
    // (DELETE) --> delete all orders with specific id
    app.delete('/orders/deleteall/:id', async (req, res) => {
      const id = req.params.id;
      const query = { product_id: id };
      console.log(query);
      const result = await Order.deleteMany(query); // delete all the matched order from database
      res.json(result); // send the response to user
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from BIRIDERPRO');
});

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
