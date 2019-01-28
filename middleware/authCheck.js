const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const authCheck = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;
  if (!token) {
    res.status(401).send('Neautorizovaný přístup: Nebyl poskytnut token.');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Neautorizovaný přístup: Špatný token.');
      } else {
        req.nickName = decoded.nickName;
        next();
      }
    });
  }
}
module.exports = authCheck;