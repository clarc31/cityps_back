/* Base de données Category : liste fermée des différents types d'expérience
Utilisé pour :  1. Définition centres d'intérêt qd un nouveau user s'inscrit
                2. Caractériser le typs qui sera posté
*/

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category : String,
})

const Category = mongoose.model ('categories', categorySchema);

module.exports = Category ;
