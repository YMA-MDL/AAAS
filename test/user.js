//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
const Activity = require('../models/activity')
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
describe('Activities', () => {
    before((done) => { //Before each test we empty the database
        Activity.remove({}, (err) => {
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
    describe('/GET activity', () => {
        it('it should ADD an the activity', (done) => {
            chai.request(server)
                .get('/api/activities')
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
      describe('/POST user', () => {
        it('it should Retrieve the created activity', (done) => {
            chai.request(server)
                .post('/api/users')
                .set({'authorization': auth})
                .send({
                    "title": "this is my nth comment with 3 dependencies",
                    "dependsOn": [{
                        "activity": "599c2a0d1872462dc41355bd"
                    },{
                        "offset":2,
                        "unit":"H",
                        "activity": "599c2b7408707c2c34fba3dc"
                    },{
                        "activity": "599c2cb230bd342f5869a350"
                    }]
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
      describe('/GET user', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/api/users')
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