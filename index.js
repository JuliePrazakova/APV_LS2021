const express = require('express');
const app = express();
const port = 3000;

const handlebars = require('express-handlebars');
const cookieParser = require("cookie-parser");
const path = require("path");

const pool = require('./db');
const bodyParser = require('body-parser');

const homeRouter = require('./routes/home');
const contactsRouter = require('./routes/contacts');
const meetingsRouter = require('./routes/meetings');

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/',
    layoutsDir: __dirname + '/views/layouts'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/contacts', contactsRouter);
app.use('/meetings', meetingsRouter);

app.listen(port, () => console.log(`App listening to port ${port}`));
