var express = require('express');
var router = express.Router();

//
require('../models/connection');
const User = require('../models/users');
// const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

router.post('/signup', (req, res) => {
/*
// Vérifier que les champs de saisie ont été remplis correctement --- quid de la photo qui ne serait pas enregistrée tt de suite ?? 
  if (!checkBody(req.body, ['firstName', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
*/
  // Enregistrement réalisé si pas d'existence de l'email ds la bdd
  User.findOne({email: {$regex : new RegExp(req.body.email, 'i')}}).then(data => {
    console.log(data)
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      // Photo : uri transmis par BE //

      // --------------------------- //
      const newUser = new User({
        name: req.body.name,
        firstname : req.body.firstname,
        photo : req.body.photo,
        username : req.body.username,
        email : req.body.email,
        token : uid2(32),
        password : hash,
        inscriptionDate : Date.now(),
        categories : req.body.categories,
        albums : [{name : 'My postyps', typs: []}],
      });

      newUser.save().then(newDoc => {
        res.json({result: true, token: newDoc.token })
      });
    } else {
      // Utilisateur déjà existant
      res.json({result : false, error: 'User already exists'});
    }
  })

})

/*
    name : String,
    firstName : String,
	  photo : String,
    username : String,
	  email: String,
    token : String,
    password : String,
	  inscriptionDate : Date,
    categories : [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
	  albums: [albumSchema],

    	  name: String,
	      typs : [{ type: mongoose.Schema.Types.ObjectId, ref: 'typs' }],

*/


/* GET users listing.
router.post('/signin', function(req, res, next) {
  res.send('respond with a resource');
});
*/

module.exports = router;
