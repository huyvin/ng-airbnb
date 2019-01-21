const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [6, 'Nom d\'utilisateur trop court: 6 caractères minimum.'],
  },
  email: {
    type: String,
    min: [6, 'Email trop court: 6 caractères minimum.'],
    unique: true,
    lowercase: true,
    required: 'Un email est obligatoire.',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    min: [6, 'Mot de passe trop court: 6 caractères minimum.'],
    required: 'Un mot de passe est obligatoire'
  },
  rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}],
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]


});


userSchema.methods.isMatchedPassword = function(passwordFromReq) {
  return bcrypt.compareSync(passwordFromReq, this.password);
};

// middleware déclenché après un 'save'
userSchema.pre('save', function(next) {
  const user = this; // represente le document

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);