const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(require('./middleware/cookieParser'));
app.use(Auth.createSession);



app.get('/',
  (req, res) => {
    res.render('index');
  });

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    console.log('models.Links: ', models.Links);
    if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        console.log('this is link: ', link); // JF
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        console.log('this is title: ', title);
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        console.log('this is results: ', results);
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        console.log('this is link: ', link);
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.get('/login',
  (req, res) => {
    res.render('login');
  });

app.get('/signup',
  (req, res) => {
    res.render('signup');
  });

app.post('/signup',
  (req, res, next) => {
    console.log(req.body);

    var username = req.body['username'];
    var password = req.body['password'];

    return models.Users.get({username})
      .then(user => {
        if (user) {
          throw user;
        }
        return models.Users.create({username, password});
      })
      .then(results => {
        return models.Sessions.update({id: req.session.id}, {userId: results.insertId});
      })
      .then (user => {
        res.redirect('/');
      })
      .catch (user => {
        // redirect
        res.redirect('/signup');
      });
  });

app.post('/login',
  (req, res, next) => {
    console.log(req.body);
    // query from the database, the associated password and salt of the user
    // then compare the input password to the user's password
    // return models.Users.compare(req.body.username, req.body.password, )
    //   .then(users => {
    //     res.redirect(301, '/');
    //   })
    //   .error(error => {
    //     res.redirect(301, '/signup');
    //   });
  });

// when pressing signup on signup url, it should store the input at username and password into the database
// then reroute to login page and log in with new credientials


/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
