# AlmaBetter Backend Project 

## Get_Youtube_Subscribers
This is a simple backend project that contains a RESTful API for getting information about YouTube channel subscribers. The project is developed with Node.js and Express, and the database used for managing the subscriber data is MongoDB. The subscriber's data consists of fields such as their ID, Names, Subscribed Channels, and Subscription Date.

The API has several endpoints that let users get data in JSON format, such as an endpoint that returns a list of all subscribers, an endpoint that returns a list of names and subscribed channels for each subscriber, and an endpoint that returns information about a subscriber based on their ID.

## API Endpoints 
1. **"/ "** -> This default route will render the "index.html file" when the app launches. 
```bash
http://localhost:3000/
```
![1](https://github.com/Sudhir561/get-youtube-subscribers/assets/89014041/df528dc8-34f3-4119-accd-94edcdae95e8)

  
2. **"/subscribers "** -> This endpoint returns an array of all subscribers in the database.
```bash
 http://localhost:3000/subscribers
 ```
![2](https://github.com/Sudhir561/get-youtube-subscribers/assets/89014041/2c50f467-e395-4a25-9ffe-aac8146fa0cc)

3. **"/subscribers/names "** -> This endpoint returns an array of subscribers with only two fields, their name and subscribed channel. 
```bash
http://localhost:3000/subscribers/names
```
![3](https://github.com/Sudhir561/get-youtube-subscribers/assets/89014041/ff71b213-097d-4393-842b-407f57c3669f)

4. **"/subscribers/:id "** -> This returns the details of subscriber whose Id is provided in endpoint. 
```bash
http://localhost:3000/subscribers/:id
```
![4](https://github.com/Sudhir561/get-youtube-subscribers/assets/89014041/2a521c4b-f438-4d78-a3af-eeba27aee1b9)

## Application Folder Structure
1. [src/app.js] -> For handling requests and responses.

2. [/index.js] -> To connect and start the server.

3. [src/createDatabase.js] -> To create database on MongoDB.

4. [src/data.js] -> Data that has to be send  to a database.

5. [src/models/subscribers.js] -> For the schema.
   
6. [src/index.html] -> The home page for the application.
```
├── src/
│   ├── app.js
│   ├── createDatabase.js
│   ├── data.js
│   ├── index.html 
│   └── models/
│       ├── subscribers.js
├── index.js   
├── {} package-lock.json
└── {}package.json
```

## Installation 

You'll need to have **Node.js** and **MongoDB** installed on your computer in order to begin working on the project. 

Once installed, Clone this repository to your **local** machine.

Install the required dependencies as mentioned below by using **npm install <packageName>**.

Start the server by **nodemon index.js**

## Dependencies
Following dependencie are needed to run this application: 

1. express

2. mongoose

3. nodemon

## Deployment

Visit to see the working on Youtube : 

Web Deployment :   https://get-youtube-subscribers-7mky.onrender.com/


 

## Api Schema Documentation

visit to see the documentation of api schema on postman:
https://documenter.getpostman.com/view/18127873/2s9Ye8euSZ


## Feedback

If you have any feedback, please reach out to us at sudhirme101@gmail.com
