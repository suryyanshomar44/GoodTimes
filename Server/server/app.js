'use strict';

const Express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const Routers = require('./routers');

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

const app = Express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://bloggers-demo.netlify.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(Express.json({ limit: '5mb', extended: true }));
app.use(Express.urlencoded({ limit: '5mb', extended: true }));

app.use('/api', Routers);

// default message
app.get('/', (req, res) => {
  res.send(`Welcome to Vada-Paav Blogs`);
});

// console.log(CONNECTION_URL);

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

