
const express = require("express"); // Import the Express framework
const path = require("path"); // Import the path module for working with file paths

//SCHEMA
const subscriberSchema = require("./models/subscribers"); // Import the subscriber model
//const { error } = require("console"); // Import the 'error' object from the console module

const app = express(); // Create an Express application

//PARSE INCOMING JSON DATA
app.use(express.json()); // Middleware to parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Middleware to parse incoming URL-encoded data




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
    let subscribers = await subscriberSchema.find(); // Retrieve all subscribers from the schema/model
    res.status(200).json(subscribers); // Send the subscribers as a JSON response with a status of 200 (OK)
  } catch (err) {
    res.status(400); // Set the response status to 400 (Bad Request)
    next(err); // Pass the error to the error handling middleware
  }
});


app.get("/subscribers/names", async (req, res, next) => {
  try {
    let subscribers = await subscriberSchema.find(
      {},
      { name: 1, subscribedChannel: 1, _id: 0 }
    ); // Retrieve subscribers with only the name and subscribedChannel fields from the schema/model
    res.status(200).json(subscribers); // Send the subscribers as a JSON response with a status of 200 (OK)
  } catch (err) {
    res.status(400); // Set the response status to 400 (Bad Request)
    next(err); // Pass the error to the error handling middleware
  }
});



// HANDLES ALL THE UNWANTED REQUESTS.
app.use((req, res) => {
  res.status(404).json({ message: "Error - Route not found" }); // Send a JSON response with a status of 404 (Not Found)
});








module.exports = app;
