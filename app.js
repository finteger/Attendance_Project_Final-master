const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { MONGODB_LOGIN } = require('./config');
const initializeDatabase = require('./data/initializeDatabase'); 
require('dotenv').config();

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');
const url = MONGODB_LOGIN;
const PORT = process.env.PORT || 8000;

app.use(logger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use routers
app.use('/', authRoutes);
app.use('/', studentRoutes);

// Connect to MongoDB and initialize the database
mongoose.connect(url)
    .then(async () => {
        console.log('Connected to MongoDB cluster.');
        await initializeDatabase(); // Ensure the database is initialized
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}.  Connected to MongoDB.`);
        });
    })
    .catch(err => console.log(`Error connecting to the database.\n${err}`));


