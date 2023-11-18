
const express = require("express"); // Import the Express framework
const path = require("path"); // Import the path module for working with file paths
const dotEnv=require('dotenv').config()


//SCHEMA
const subscriberSchema = require("./models/subscribers"); // Import the subscriber model
//const { error } = require("console"); // Import the 'error' object from the console module

const app = express(); // Create an Express application

//PARSE INCOMING JSON DATA
app.use(express.json()); // Middleware to parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Middleware to parse incoming URL-encoded data

const cors = require("cors");
app.use(cors());


// POST endpoint to add a new subscriber
app.post("/subscribers", async (req, res, next) => {
  try {
      const { name, subscribedChannel, subscribedDate } = req.body;

      // Validate if required fields are provided
      if (!name || !subscribedChannel) {
          res.status(400).json({ error: "Name and subscribedChannel are required." });
          return;
      }

      // Check if a subscriber with the same name and subscribedChannel already exists
      const existingSubscriber = await subscriberSchema.findOne({ name, subscribedChannel });

      if (existingSubscriber) {
          res.status(409).json({ error: "Data already exists, please try with different 'names' and 'subscribedChannel' request." });
          return;
      }

      // Set subscribedDate to the current date if not provided in the request
      const dateToUse = subscribedDate ? new Date(subscribedDate) : new Date();

      // Create a new subscriber
      const newSubscriber = new subscriberSchema({
          name,
          subscribedChannel,
          subscribedDate: dateToUse
      });

      // Save the new subscriber to the database
      const savedSubscriber = await newSubscriber.save();

      res.status(201).json(savedSubscriber); // Respond with the saved subscriber and a status of 201 (Created)
  } catch (err) {
      res.status(400);
      next(err);
  }
});

//HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html")); // Serve the index.html file as the home page
});

//THIS ROUTE SHOWS ALL THE SUBSCRIBERS LIST WITH DETAILS
app.get("/subscribers", async (req, res, next) => {
  try {
    let subscribers = await subscriberSchema.find({});

    if (subscribers.length > 0) {
      // If subscribers are found, return the data
      res.status(200).json(subscribers);
    } else {
      // If no subscribers are found, return a custom message
      res.status(200).json({ message: "No subscribers data found" });
    }
  } catch (err) {
    // Handle errors
    res.status(400).json(err.message);
    next(err);
  }
});



app.get("/subscribers/names", async (req, res, next) => {
  try {
    let subscribers = await subscriberSchema.find({}, { name: 1, subscribedChannel: 1, _id: 0 });

    if (subscribers.length > 0) {
      // If subscribers are found, return the data
      res.status(200).json(subscribers);
    } else {
      // If no subscribers are found, return a custom message
      res.status(200).json({ message: "No subscribers data  found by name" });
    }
  } catch (err) {
    // Handle errors
    res.status(400).json(err.message);
    next(err);
  }
});


// THIS ROUTE PROVIDES THE DETAILS OF SUBSCRIBER WITH THE GIVEN ID.
app.get("/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id; // Extract the ID parameter from the request URL

    // Attempt to find a subscriber with the given ID in the schema/model
    const subscriber = await subscriberSchema.findById(id);

    if (subscriber) {
      return res.status(200).json(subscriber); // Send the subscriber details as the response
    } 
    else 
    return res.status(404).json({ message: "Subscriber not found" });
  } catch (error) {
    // Handle the error
    return res.status(400).json({ "error": {
      "code": "InvalidId",
      "message": "The provided _id is not of the correct length (12 bytes or 24 character)."
    } }); // Send a JSON response with a status of 404 (Not Found)
  }
});



// HANDLES ALL THE UNWANTED REQUESTS.
app.use((req, res) => {
  res.status(404).json({ message: "Error - Route not found" }); // Send a JSON response with a status of 404 (Not Found)
});








module.exports = app;
