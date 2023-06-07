import express from 'express';
import colors from 'colors';
import { engine } from 'express-handlebars';
import path from 'path';
import { helpers } from './helpers/handlebars';
import cookieParser from 'cookie-parser';

import mainRoute from './routes/main.routes';

import { createAdmin } from './libs/createAdmin';

import './controllers/connection'; // Database connection

const app = express();

createAdmin();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers
}));

app.set('view engine', '.hbs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use(mainRoute);

// Public
app.use(express.static(path.join(__dirname, 'public')));

// 404
app.use(function(req, res, next) {
    res.status(404).redirect('/404');
});


export default app;