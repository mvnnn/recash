import express from 'express';
let app = express();
let port = process.env.PORT || 8080;
import mongoose from 'mongoose';
import passport from 'passport';
import flash    from 'connect-flash';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';

import AppConnectedFunc from './app/routes.js';
import configDB from './config/database.js';
import passportFunc from './config/passport';


mongoose.connect(configDB.url);

passportFunc(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( express.static( "uploads" ) );
app.set('view engine', 'ejs');

// required for passport
app.use(session({
    secret: 'recashsecret', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


AppConnectedFunc(app, passport);

app.listen(port);
console.log('Server running on port :' + port);
