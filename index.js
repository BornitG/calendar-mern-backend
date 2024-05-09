const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

// Database
dbConnection();

// Cors
app.use(cors());

//Public Directory
app.use( express.static('public') );

//read and parse body
app.use( express.json() );

//Routes
app.use('/api/auth', require('./routes/auth'));

// Crud: Events
app.use('/api/events', require('./routes/events'));

//Listen requests
app.listen( process.env.PORT, () => {
    console.log(`Server running ${ process.env.PORT }`);
})