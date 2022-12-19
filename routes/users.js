var express = require('express');
var router = express.Router();

//
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

// ---------------------------------------------- route user/signup ----------------------------------------------
router.post('/signup', async (req, res) => {
  // console.log('backend test',req);
  // console.log('req.body',req.body);
  // console.log('req.files',req.files);

  // Vérifier que les champs de saisie ont été remplis correctement --- quid de la photo qui ne serait pas enregistrée tt de suite ?? 
  
  if (!checkBody(req.body, ['name','firstname', 'username', 'email', 'password', 'categories'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const {name, firstname, username, email, password, categories} = req.body;
  const categoriesArray = categories.split(',')

  //----------------------------------cloudinary post------------------------------------------------------------------//
  let photo = '../assets/avatar.png'

  if (req.files !== null) {
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);
    if(!resultMove) {
      const resultCloudinary = 
       await cloudinary.uploader.upload(photoPath);
      photo = resultCloudinary.secure_url
    } else {
      // IL FAUDRAIT FAIRE UN TRAITEMENT DES ERREURS
    }
    fs.unlinkSync(photoPath);

  }

//----------------------------------------------------------------------------------------------------------------------//
  // console.log("categoriesArray", categoriesArray)
  // Enregistrement réalisé si pas d'existence de l'email ds la bdd
  User.findOne({email: {$regex : new RegExp(req.body.email, 'i')}}).then(data => {
    // console.log(data)
    if (data === null) {

      const hash = bcrypt.hashSync(password, 10);

      // Photo : uri transmis par BE //
      const newUser = new User({
        name: name,
        firstname : firstname,
        photo : photo,
        username : username,
        email : email,
        token : uid2(32),
        password : hash,
        inscriptionDate : Date.now(),
        categories : categoriesArray,
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
//-------------------------------------------------- route cloudinary ----------------------------------------------//
// router.post('/signup', async (req, res) => {
//   const photoPath = `./tmp/${uniqid()}.jpg`;
//   const resultMove = await req.files.photoFromFront.mv(photoPath);

//   if(!resultMove) {
//     const resultCloudinary = 
//      await cloudinary.uploader.upload(photoPath);

//      res.json({ result: true, url: resultCloudinary.secure_url});
//   } else {
//     res.json({ result: false, error: resultMove});
//   }
//   fs.unlinkSync(photoPath);
// })

// ---------------------------------------------- route user/signin ----------------------------------------------
router.post('/signin', (req, res) => {
  
  /*if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }*/
  
  console.log('Du FE', req.body)

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ 
        result: true, 
        token: data.token, 
        userId: data._id, 
        username: data.username,
        categories: data.categories,
        albums: data.albums
      });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


// ---------------------------------------------- route user ----------------------------------------------
router.get('/', (req, res) => {
  // console.log('yyyyyy',req.body)
  User.findOne({ token: req.body.token }).then(data => {
    if (data) {
      res.json({ result: true, data: data});
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

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
