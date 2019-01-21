const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');

const mongooseHelpers = require('../helpers/mongoose');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});



router.get('/:id', (req, res) => {

  const rentalId = req.params.id;

  Rental.findById(rentalId)
        .populate('user', 'username -_id')
        .populate('bookings', 'startAt endAt -_id')
        .exec(function(err, foundRental) {

    if (err || !foundRental) {
      return res.status(422).send({errors: [{title: 'Erreur de location !', detail: 'Location inexistante'}]});
    }

    return res.json(foundRental);
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};

  Rental.find(query)
      .select('-bookings')
      .exec(function(err, foundRentals) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (city && foundRentals.length === 0) {
      return res.status(422).send({errors: [{title: 'No Rentals Found!', detail: `There are no rentals for city ${city}`}]});
    }

    return res.json(foundRentals);
  });
});






module.exports = router;