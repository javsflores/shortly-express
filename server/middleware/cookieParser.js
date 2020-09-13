const parseCookies = (req, res, next) => {

  // res.cookie('test3', 'helloo world'); // ADDING COOKIES PROBS NOT NEEDED
  // console.log('req object: ', req.cookies);

  let cookieString = req.get('Cookie');
  // console.log('this is cookieString: ', cookieString);

  parsedCookies = cookieString.split('; ').reduce((cookies, cookie) => {
    // cookieString.split(';') === [test1=hello%20world, test3=helloo%20world].reduce()
    if (cookie) {
      let parts = cookie.split('=');
      // parts === [test, hello world]
      cookies[parts[0]] = parts[1];
      // {test1: hello world, test3: hellooo world}
    }
    return cookies;
  }, {});

  req.cookies = parsedCookies;
  // console.log('parsed', req.cookies);

  next();
};

module.exports = parseCookies;