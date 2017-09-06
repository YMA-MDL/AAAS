//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
const Document = require('../models/document')
const User = require('../models/user')

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

let should = chai.should();
var auth = ""


// load libraries
const JWT = require('jsonwebtoken')
const { JWT_SECRET } = require('../auth')

//---------------------------------------------------------------
// utility functions
//---------------------------------------------------------------

signToken = user => {
    return JWT.sign({
        iss: 'activitiesAPI',
        sub: user.id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current date + 1 day
    }, JWT_SECRET)
}

//---------------------------------------------------------------
// Test Script
//---------------------------------------------------------------

chai.use(chaiHttp);
//Our parent block
describe('Documents', () => {
    before((done) => { //Before each test we empty the database
        Document.remove({}, (err) => {
            User.remove({}, (err) => {
                const newUser = new User()
                newUser.email = "johndoe@test.eu"
                newUser.password = "password"
                newUser.save(() =>{
                    User.findOne({ "email":"johndoe@test.eu" })
                    .then(user => {
                        auth = signToken(user)
                        done()
                    })
                })
            });
        });

    });



    /*
      * Test the /GET route
      */
    describe('/GET document', () => {
        it('it should find no document', (done) => {
            chai.request(server)
                .get('/api/documents')
                .set({'authorization': auth})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
        /*
      * Test the /POST route
      */
      describe('/POST document', () => {
        it('it should add and return the created document', (done) => {
            chai.request(server)
                .post('/api/documents')
                .set({'authorization': auth})
                .send({
                    "name": "this is a document"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    
    /*
      * Test the /GET route
      */
      describe('/GET document', () => {
        it('it should GET all the documents', (done) => {
            chai.request(server)
                .get('/api/documents')
                .set({'authorization': auth})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
});