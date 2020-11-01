const path = require('path');


const express = require('express');
//const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');





const app = express();
app.enable('trust proxy');




// CREATE PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'client/dist')));


// Useful Security & Parsing Middleware
app.use(helmet());
//app.use('/api', rateLimit({ max: 100, windowMs: 1000 * 60 * 60, message: 'Too many requests from thie IP, please try again in an hour'}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());



// Define Routes
app.get('/', (req, res, next) => res.status(200).sendFile(path.join(__dirname, 'client/dist/game.html')));

app.get('/create', (req, res, next) => res.status(200).sendFile(path.join(__dirname, 'client/dist/admin.html')));

app.get('*', (req, res, next) => res.redirect('/'));




module.exports = app;