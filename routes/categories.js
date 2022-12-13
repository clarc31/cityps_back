var express = require('express');
var router = express.Router();

//
require('../models/connection');
const Category = require('../models/categories');
//const { checkBody } = require('../modules/checkBody');

router.get('/', (req, res) => {
    Category.find().then(data => {
      if (data) {
        res.json({ result: true, data: data});
      } else {
        res.json({ result: false, error: 'Category not found' });
      }
    });
  });


module.exports = router;