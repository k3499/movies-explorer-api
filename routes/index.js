const router = require('express').Router();
const { createUser, login } = require('../controllers/users.js');
const { signupValidator, signinValidator } = require('../middlewares/validations');
const auth = require('../middlewares/auth');
const notRoutes = require('./notRoutes');

const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.post('/signup', signupValidator, createUser);
router.post('/signin', signinValidator, login);

router.use(auth);
router.use('/users/me/', usersRouter)
router.use('/movies', moviesRouter)
router.use(notRoutes);
module.exports = router;