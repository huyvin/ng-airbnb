const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const FakeDb = require('./fakeDb');


const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');


const config = require('./config/config');

mongoose.connect(config.DB_URI, { useCreateIndex: true, useNewUrlParser: true }).then(() => {
  if (process.env.NODE_ENV !== 'production') {
    const fakeDb = new FakeDb();
    //fakeDb.seedDb();
  }
});

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);


app.listen(PORT, () => {
  console.log("Serveur Node executé sur le port " + PORT);
});