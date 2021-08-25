const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');
require('dotenv').config();

const { JWT_SECRET = 'dev-secret', NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;

  next();
};
