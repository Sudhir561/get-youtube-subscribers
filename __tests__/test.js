const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Update the path accordingly
const expect = chai.expect;

chai.use(chaiHttp);

describe('YouTube Subscribe App', () => {
  // Test case for adding a new subscriber
  it('should add a new subscriber', (done) => {
    chai
      .request(app)
      .post('/subscribers')
      .send({ name: 'sudhir', subscribedChannel: 'kumar' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        

        done();
      });
  });

  //Test case for handling invalid input
  it('should handle invalid input', (done) => {
    chai
      .request(app)
      .post('/subscribers')
      .send({ name: '', subscribedChannel: 'Test Channel' }) // name should not be empty
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // Test case for handling duplicate subscribers
  it('should handle duplicate subscribers', (done) => {
    chai
      .request(app)
      .post('/subscribers')
      .send({ name: 'John Doe', subscribedChannel: 'Test Channel' })
      .end(() => {
        chai
          .request(app)
          .post('/subscribers')
          .send({ name: 'John Doe', subscribedChannel: 'Test Channel' })
          .end((err, res) => {
            expect(res).to.have.status(409);
            done();
          });
      });
  });

  // Test case for retrieving all subscribers
  it('should retrieve all subscribers', (done) => {
    chai
      .request(app)
      .get('/subscribers')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        // Add more assertions for the retrieved subscribers data

        done();
      });
  });

  // Test case for retrieving subscribers with names and channels only
  it('should retrieve subscribers with names and channels only', (done) => {
    chai
      .request(app)
      .get('/subscribers/names')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        // Add more assertions for the retrieved subscribers data

        done();
      });
  });

  // Test case for retrieving details of a subscriber by ID
  it('should retrieve details of a subscriber by ID', (done) => {
    // Assume you have a subscriber ID from a previous test or database
    const subscriberId = '6556499fe967353be4393f0a';
    chai
      .request(app)
      .get(`/subscribers/${subscriberId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
       

        done();
      });
  });

  // Test case for handling a non-existent subscriber ID
  it('should handle a non-existent subscriber ID', (done) => {
    const nonExistentId = 'non_existent_id';
    chai
      .request(app)
      .get(`/subscribers/${nonExistentId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'Subscriber not found');

        done();
      });
  });

  //Test case for handling unknown routes
  it('should handle unknown routes', (done) => {
    chai
      .request(app)
      .get('/unknown-route')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'Error - Route not found');

        done();
      });
  });

  
});
