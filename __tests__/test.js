const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const mongoose = require('mongoose');

const { expect } = chai;

chai.use(chaiHttp);

before(async () => {
  // Connect to a test database or perform any setup you need
  // This will depend on your testing environment and strategy
  await mongoose.connect('mongodb+srv://sudhirdb:sudhir123@cluster0.ap7jc2a.mongodb.net/youtubesubscribers?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  // Disconnect from the test database or perform any cleanup
  await mongoose.disconnect();
});

// Test cases for the POST /subscribers endpoint
describe('POST /subscribers', () => {
  //test case for create a new subscriber
  it('should create a new subscriber', async () => {
    const response = await chai
      .request(app)
      .post('/subscribers')
      .send({
        name: 'Test User',
        subscribedChannel: 'Test Channel',
        subscribedDate: '2023-11-20T00:00:00.000Z', // Provide a valid date here
      });

    expect(response).to.have.status(201);
    expect(response.body).to.have.property('name', 'Test User');
    expect(response.body).to.have.property('subscribedChannel', 'Test Channel');
  });

  //test case for return an error for incomplete data
  it('should return an error for incomplete data', async () => {
    const response = await chai
      .request(app)
      .post('/subscribers')
      .send({});

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  //test case for existing data in database
  it('should return an error for existing subscriber', async () => {
    
   //send  request data which is   existing in database
    const response = await chai
      .request(app)
      .post('/subscribers')
      .send({
        name: 'Test User',
        subscribedChannel: 'Test Channel',
      });

    expect(response).to.have.status(409);
    expect(response.body).to.have.property('error');
  });
});

// Test cases for the Get /subscribers endpoint
describe('GET /subscribers', () => {
  //test case for getting response of subscribers data from database
  it('should return a list of subscribers', async () => {
    const response = await chai
      .request(app)
      .get('/subscribers');

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('array');
  });

  //test case for response if no data in database
  it('should return a custom message for no data found', async () => {
    // Assuming the database is empty
    const response = await chai
      .request(app)
      .get('/subscribers');

    expect(response).to.have.status(404);
    expect(response.body).to.have.property('message', 'No subscribers data found');
  });
});

// Test cases for the Get /subscribers/names endpoint
describe('GET /subscribers/names', () => {
  // test case for getting list of subscriber names
  it('should return a list of subscriber names', async () => {
    const response = await chai
      .request(app)
      .get('/subscribers/names');

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('array');
  });

  //test case if no data found 
  it('should return a custom message for no data found', async () => {
    // Assuming the database is empty
    const response = await chai
      .request(app)
      .get('/subscribers/names');

    expect(response).to.have.status(404);
    expect(response.body).to.have.property('message', 'No subscribers data  found by name');
  });
});


// Test cases for the Get /subscribers/:id endpoint
describe('GET /subscribers/:id', () => {
  //if provided id exist in database
  it('should return details of a subscriber', async () => {
    // Create a subscriber to get its ID
    const createResponse = await chai
      .request(app)
      .post('/subscribers')
      .send({
        name: 'Test User2',
        subscribedChannel: 'Test Channel2',
      });

    const response = await chai
      .request(app)
      .get(`/subscribers/${createResponse.body._id}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('name', 'Test User2');
    expect(response.body).to.have.property('subscribedChannel', 'Test Channel2');
  });

  // if ID is invalid or not correct length
  it('should return an error for an invalid ID', async () => {
    const response = await chai
      .request(app)
      .get('/subscribers/invalidId');

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  // if ID format is correct but not exist in database
  it('should return an error for a non-existing subscriber', async () => {
    const response = await chai
      .request(app)
      .get('/subscribers/123456789012345678901234');

    expect(response).to.have.status(404);
    expect(response.body).to.have.property('message', 'Subscriber not found');
  });
});
