const express = require("express")
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('config'); //we load the db location from the JSON files
const options = { 
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
  }; 


mongoose.Promise = global.Promise

mongoose.connect(config.DBHost + config.DBinstance,options)


const app = express()

// set the rendering machine for the public website
app.set('view engine', 'jade');


app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
  });


// Routes definition
const users = require('./api/routes/users')
const activities = require('./api/routes/activities')

// middleware
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(logger('dev')); 
    
}
app.use(bodyParser.json())

// serve static documentation
app.use('/api/help/doc',express.static('api/apidoc'));

// Routes usage
app.use('/api/users', users)
app.use('/api/activities',activities)

// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error Handler
app.use((req, res, next) => {
    const err = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    // respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    })

    // respond to ourselves
    console.error(err)
})

// start the server
const port = app.get('port') || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}`))

module.exports = app; // for testing