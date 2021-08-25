const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const router = require('./routes');
const allErrors = require('./errors/allErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://mesto.k3499.nomoredomains.club',
];
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы из любого источника
    res.header('Access-Control-Allow-Origin', '*');
  }
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  return next();
});

app.use('/', express.json());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors()); // обработчик celebrate

app.use(allErrors);

app.listen(PORT, () => {

});
