const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  // check for session cookie
  // Promise turns any value into a promise, therefore you can use a promise chain
  // Promise.resolve(req.cookies.shortlyid)
  //.then((hash) => {
  // if !exists -> make a new session
  // if(!hash){
  // make a new session
  // throw hash;
  //}
  // attempt to load session from database
  // return models.Sessions.get({hash})o
  // })
  // if !exists -> make a new session
  // if(!session)
  // make a session
  // throw session
  // }
  // return session
  //.catch(() => {
  // models.Sessions.create()
  // .then(results => {
  // return models.Sessions.get({id: results.insertID});
  //})
  // .then (session => {
  // res.cookie('shortlyid', session.hash);
  // return session;
  //})
  //}
  //.then((session) =? {
  // otherwise -> set session on req object
  //req.session = session;
  //}
  //next();
  //


};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

