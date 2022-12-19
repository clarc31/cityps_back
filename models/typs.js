// Base de donnée Typ : un document contient les informations du typs

const mongoose = require('mongoose');

const typSchema = mongoose.schema ({
    title : String,
    city : String,
    votePlus : String,
    voteMinus : String,
    date : Date,
    images : String,
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    category : { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    coordinates : {latitude:Number, longitude:Number},
})

const Typ = mongoose.model('typs', typSchema);

module.exports = Typ;
