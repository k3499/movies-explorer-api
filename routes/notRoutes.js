const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

router.use('*', () => {
  throw new NotFoundError('Такой путь не существует.');
});

module.exports = router;
