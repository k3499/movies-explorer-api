const router = require('express').Router();
const { movieValidator, delMovieValidator } = require('../middlewares/validations');
const { getMovies, deleteMovie, addMovie, } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', movieValidator, addMovie);

router.delete('/:movieId', delMovieValidator, deleteMovie);

module.exports = router;