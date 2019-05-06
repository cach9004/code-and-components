var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

const dashboardRouter = require("./routes/dashboard");         
const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");

var app = express();

var oktaClient = new okta.Client({
  orgUrl: 'https://dev-172962.okta.com',
  token: '00zaN_yy5GzA6xquE4T7Z7uuS9AT5ZlcVAXrkl5iPu'
});

const oidc = new ExpressOIDC({
  issuer: "https://dev-172962.okta.com/oauth2/default",
  client_id: '0oahq27bdPDjhgbqW356',
  client_secret: 'wRXqSJzejFB2zp1jPwR45p-cqyvyjkb44o_SBPsw',
  redirect_uri: 'http://localhost:3000/users/callback',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});


/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
/*const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'doctor',
	user: 'postgres',
	password: 'milligan'
};

//Create Database Connection
var pgp = require('pg-promise')();

var db = pgp(dbConfig);
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'aeiurhaopiwerj23o204943mnoif',
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});
/*
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    It checks to see if there is a currently logged in user or not by looking at the req.userinfo object. If there is no user logged in, it will do nothing (return next();).
    If there IS a user logged in, this middleware will then use the Okta Node SDK library to retrieve the user object from the Okta API.
    Finally, it will create two new values: req.user and res.locals.user which point to the user object directly.
This means that in any route we define later on, we could access the req.user object directly to view the user's information, edit it, or even delete it.
*/

app.get('/test', (req, res) => {
  res.json({ profile: req.user ? req.user.profile : null });
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
}



app.use('/', publicRouter);
app.use('/dashboard', loginRequired, dashboardRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/*//index after search
app.get('/index/search__by_location', function(req, res) {
  var location = req.query.search;
  var states = "SELECT state FROM doctors ORDER BY ASC;";
  var selection = "SELECT name FROM doctors WHERE state = '" + location +"';";
  console.log("SELECT name FROM doctors WHERE state = '" + location +"';");
  db.task('get-everything', task => {
    return task.batch([
        task.any(states),
        task.any(selection)
      ]);
  })
  .then(info => {
    res.render('pages/index',{ 
      my_title: "Homepage cont.",
      state_list: info[0],
      input1: location,
      result: info[1][0]
    })
  })
  .catch(error => {
    request.flash('error', err);
    response.render('pages/index', {
      title: 'Homepage',
      statelist: '',
      input1: '',
      result:''
    })
  });
});*/
/*
app.get('/home/pick_color', function(req, res) {
  var color_choice = req.query.color_selection;
  var color_options =  'select * from favorite_colors;';
  var color_message = "select color_msg from favorite_colors where hex_value = '" + color_choice + "';"; 
  db.task('get-everything', task => {
        return task.batch([
            task.any(color_options),
            task.any(color_message)
        ]);
    })
    .then(info => {
      res.render('pages/home',{
        my_title: "Home Page",
        data: info[0],
        color: color_choice,
        color_msg: info[1][0].color_msg
      })
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });
  
});


app.post('/home/pick_color', function(req, res) {
  var color_hex = req.body.color_hex;
  var color_name = req.body.color_name;
  var color_message = req.body.color_message;
  var insert_statement = "INSERT INTO favorite_colors(hex_value, name, color_msg) VALUES('" + color_hex + "','" + 
              color_name + "','" + color_message +"') ON CONFLICT DO NOTHING;";

  var color_select = 'select * from favorite_colors;';
  db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(color_select)
        ]);
    })
    .then(info => {
      res.render('pages/home',{
        my_title: "Home Page",
        data: info[1],
        color: color_hex,
        color_msg: color_message
      })
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });
});

*/
module.exports = app;
