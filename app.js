const express = require("express")
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var path = require("path")
const config = require('config'); //we load the db location from the JSON files

const options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true
};

// DATABASE INIT

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true);
mongoose.connect(config.DBHost + config.DBinstance, options)
mongoose.connection.on('error', function (error) {
    console.error('Database connection error:', error);
});

mongoose.connection.once('open', function () {
    console.log('Database connected');
});

// SERVER LAUNCH

const app = express()


// Routes definition

app.get('/app/:page', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});


const users = require('./api/routes/users')
const activities = require('./api/routes/activities')

// middleware
if (config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(logger('dev'));

}
app.use(bodyParser.json())

// serve static documentation
app.use(express.static('public'));
app.use('/app', express.static('client'));
app.use('/app', express.static('node_modules'));
app.use('/api/help/doc', express.static('api/apidoc'));

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

// Routes usage
app.use('/api/users', users)
app.use('/api/activities', activities)

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
var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`))

module.exports = app; // for testing