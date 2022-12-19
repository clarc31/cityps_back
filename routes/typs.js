var express = require('express');
var router = express.Router();

require('../models/connection');
const Typ = require('../models/typs');
const { checkBody } = require('../modules/checkBody');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

// ---------------------------------------------- route user/signup ----------------------------------------------
router.post('/', async (req, res) => {
  
    // Vérifier que les champs de saisie ont été remplis correctement --- quid de la photo qui ne serait pas enregistrée tt de suite ?? 
    /*if (!checkBody(req.body, ['name','firstname', 'username', 'email', 'password', 'categories'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }*/
  

    const {name, firstname, username, email, password, categories} = req.body;
    const categoriesArray = categories.split(',')
  
    //----------------------------------cloudinary post 3 photos------------------------------------------------------------------//
    let photo = '../assets/avatar.png' // photo par défaut-> ?
  
    if (req.files !== null) {
      const photoPath = `./tmp/${uniqid()}.jpg`;
      const resultMove = await req.files.photoFromFront.mv(photoPath);
      if(!resultMove) {
        const resultCloudinary = 
         await cloudinary.uploader.upload(photoPath);
        photo = resultCloudinary.secure_url
      } else {
        // Erreur à traiter
      }
      fs.unlinkSync(photoPath);
    }

    //- enregistrement dans la BDD
  
        Typ.findOne({content: content}).then(data => {

            if (data === null) {

              const newTyp = new Typ({
                title: name,
                city : city,
                votePlus : votePlus,
                voteMinus : voteMinus,
                dete : Date.now(),
                images : cloudyData,
                author : user_Id,
                category : category_Id,
                coordinates : coordinates
              });
        
              newTyp.save().then(dataTyp => {
                res.json({result: true, data: dataTyp })
              });
            } else {
              // Texte descriptif déjà existant
              res.json({result : false, error: 'Text already exists'});
            }
          })
    })

module.exports = router;