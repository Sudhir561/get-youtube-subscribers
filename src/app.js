
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
























module.exports = app;
