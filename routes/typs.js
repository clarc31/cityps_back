var express = require("express");
var router = express.Router();

require("../models/connection");
const Typ = require("../models/typs");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");

// ---------------------------------------------- route user/signup ----------------------------------------------
router.post("/", async (req, res) => {
  // Vérifier que les champs de saisie ont été remplis correctement
  /*if (!checkBody(req.body, ['title','content', 'pictures', 'email', 'password', 'categories'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }*/

  const { title, city, content, author, latitude, longitude, categories } =
    req.body;
  const categoriesArray = categories.split(",");

  console.log(categoriesArray);

  //----------------------------------cloudinary post 3 photos------------------------------------------------------------------//
  // let photo = "../assets/avatar.png"; // photo par défaut-> ?
  const photos = [];
  console.log(req.files);
  if (req.files !== null) {
    for (let i = 0; i < req.files.photo.length; i++) {
      const photoPath = `./tmp/${uniqid()}.jpg`;
      const resultMove = await req.files.photo[i].mv(photoPath);
      if (!resultMove) {
        const resultCloudinary = await cloudinary.uploader.upload(photoPath);
        console.log(resultCloudinary);
        photos.push(resultCloudinary.secure_url);
      } else {
        // Erreur à traiter
      }
      fs.unlinkSync(photoPath);
    }
  }
  //- enregistrement dans la BDD

  User.findOne({ token: author }).then((data) => {
    const newTyp = new Typ({
      title,
      city,
      content,
      date: Date.now(),
      pictures: photos,
      author: data._id,
      category: categoriesArray,
      coordinates: { latitude, longitude },
    });

    newTyp.save().then((dataTyp) => {
      res.json({ result: true, data: dataTyp });
    });
  });
});

// HOMESCREEN : Créer une route GET "existingTipsbyCity"
// (qui affiche tous les tips dispo sur l'appli toutes categories confondues pour cette ville)

router.get("/:city", (req, res) => {
  Typ.find({ city: req.params.city })
    .populate("author")
    .then((data) => {
      console.log(data);
      res.json({ result: true, city: data });
    });
});

module.exports = router;
