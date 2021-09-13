const Movie = require('../models/movie');
const { ERR_CODE_200 } = require('../serverErrors');
const BadRequest = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden');
const { movieIdNotFound, movieNotAllowed, badRequest } = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => res.status(ERR_CODE_200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(movieIdNotFound))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden(movieNotAllowed);
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => res.send(deletedMovie))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(
                new BadRequest(badRequest),
              );
            }
            return next(err);
          });
      }
    })
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  // const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(ERR_CODE_200).send({
      _id: movie._id,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
      owner: movie.owner,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest(badRequest),
        );
      }
      return next(err);
    });
};

module.exports = {

  getMovies, deleteMovie, addMovie,

};
