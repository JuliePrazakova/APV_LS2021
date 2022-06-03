const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const handlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const initializePassport = require('./passportConfig');
initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());
//app.use(flash());

const homeRouter = require('./routes/home');
const contactsRouter = require('./routes/contact');
const meetingsRouter = require('./routes/meeting');
const registerRouter = require('./routes/register');
const signinRouter = require('./routes/signin');
const lostPasswordRouter = require('./routes/lostPassword');
const pageNotFoundRouter = require('./routes/pageNotFound');
const logOut = require('./routes/logout');


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

app.use('/', signinRouter);
app.use('/contact', contactsRouter);
app.use('/meeting', meetingsRouter);
app.use('/signin', signinRouter);
app.use('/register', registerRouter);
app.use('/lostpassword', lostPasswordRouter);
app.use('/logout', logOut);
app.use('*', pageNotFoundRouter);

app.listen(port, () => console.log(`App listening to port ${port}`));
