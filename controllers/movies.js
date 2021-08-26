const Movie = require('../models/movie');
const { ERR_CODE_200 } = require('../serverErrors');
const BadRequest = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => res.status(ERR_CODE_200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .orFail(new NotFoundError('Карточка не найдена.'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Можно удалять только свои карточки.');
      } else {
        res.status(ERR_CODE_200).send({ message: `Карточка ${movie} удалена` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Передан неправильный ID карточки.'),
        );
      }
      return next(err);
    });
};

const addMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

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
    owner,
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
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Некорректные данные создания карточки.'),
        );
      }
      return next(err);
    });
};

module.exports = {

  getMovies, deleteMovie, addMovie,

};
