// Base de donnée Typ : un document contient les informations du typs

const mongoose = require('mongoose');

const typSchema = mongoose.Schema ({
    title : String,
    city : String,
    content : String,
    votePlus : String,
    voteMinus : String,
    date : Date,
    pictures : [String],
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    category : { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    coordinates : {latitude:Number, longitude:Number},
})

const Typ = mongoose.model('typs', typSchema);

module.exports = Typ;
