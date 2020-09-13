const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  // check for session cookie
  // Promise turns any value into a promise, therefore you can use a promise chain
  Promise.resolve(req.cookies.shortlyid)
    .then((hash) => {
    // if !exists -> make a new session
      if (!hash) {
      // make a new session
        throw hash;
      }
      // attempt to load session from database
      return models.Sessions.get({hash});
    })
    .then(session => {
      if (!session) {
        throw session;
      }
      return session;
    })
    // if there is no cookie or session, catch will create one
    .catch(() => {
      return models.Sessions.create()
        .then(results => {
          return models.Sessions.get({id: results.insertId});
        })
        .then(session => {
          res.cookie('shortlyid', session.id);
          return session;
        });
    })
    .then(session => {
      req.session = session;
      // console.log('req.cookies', req.cookies);
      // console.log('req.session', req.session);
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};