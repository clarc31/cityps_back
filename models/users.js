/* Base de donnée User : 
photo : enregistré sur Cloudinary
categories : liste fermée des envies du user >> relation avec collection categories
albumSchema : nom de l'album créé par user + tableau FK pour typs liés
*/

const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
	name: String,
	typs : [{ type: mongoose.Schema.Types.ObjectId, ref: 'typs' }],
});

const userSchema = mongoose.Schema({
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
});

const User = mongoose.model('users', userSchema);

module.exports = User;
