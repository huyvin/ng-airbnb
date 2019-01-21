const User = require('../models/user');
const mongooseHelpers = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.auth = (req, res) => {
  const {email, password} = req.body;

  if(!password || !email) {
    return res.status(422).send({errors: [{title: 'Erreur de complétion.', detail: 'Veuillez compléter tous les champs'}]});
  }

  User.findOne({email}, (err, user) => {
    if (err) {
      return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
    }

    if (!user) {
      return res.status(422).send({errors: [{title: 'Utilisateur non trouvé.', detail: 'Utilisateur non existant.'}]});
    }

    if(user.isMatchedPassword(password)) {
      //on retourne le token
      const token = jwt.sign({
        userId: user.id,
        username: user.username
        }, config.SECRET, { expiresIn: '1h'}
      );

      return res.json(token);

    } else {
      return res.status(422).send({errors: [{title: 'Erreur d\'authentification', detail: 'Utilisateur/Mot de passe incorrect.'}]});

    }
  });
}

exports.register = (req, res) => {
// const {username, email, password, password2} = req.body;

  //on recupere toutes les infos du body
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  // on fait les verifs
  if(!password || !email || !username) {
    return res.status(422).send({errors: [{title: 'Veuillez compléter tous les champs.', detail: ''}]});
  }

  if(password !== password2) {
    return res.status(422).send({errors: [{title: 'Mot de passe invalide.', detail: 'Veuillez entrer le même mot de passe'}]});
  }

  User.findOne({email}, (err, emailTaken) => {
    if(err) {
      return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
    }

    if(emailTaken) {
      return res.status(422).send({errors: [{title: 'Email invalide.', detail: 'Email déjà existant.'}]});
    }

    const user = new User({
      username: username,
      email: email,
      password: password
    });
  
    user.save((err) => {
      if(err) {
        return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
      }
  
      return res.json({'success': true});
  
    });
  });

  //on ajoute l'utilisateur dans la BD

  //res.json({username, email, password, password2});
}


exports.authMiddleware = function(req, res ,next) {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    User.findById(user.userId, (err, user) => {
      if(err) {
        return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});

      }

      if (user) {
        res.locals.user = user;
        next();
      } else {
        return res.status(401).send({errors: [{title: 'Autorisation refusée.', detail: 'Vous devez vous enregistrer.'}]});

      }
    });
  }
  else {
    return res.status(401).send({errors: [{title: 'Autorisation refusée.', detail: 'Vous devez vous enregistrer.'}]});
  }
}

function parseToken(token) {

  // split pour enlever Bearer du token car token au format Bearer + token
  return jwt.verify(token.split(' ')[1], config.SECRET);
}