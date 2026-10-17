/**Installation do (dotenv) le lien est securise avec gitIGNORE dans le fichier (.env)  */
require('dotenv').config();

var express = require('express');
var logger = require('morgan');
var cors = require('cors');

/* Ajoute de la  bibliothèque Mongoose(au lieu de Monk) */
const mongoose = require('mongoose');

var usersRouter = require('./routes/users');
var petsRouter = require('./models/petJSON');
const authRoutes = require('./routes/loginGoogle');
var app = express();

// Adresse du site autorisée à appeler l'API : FRONTEND_URL du .env (en ligne), sinon le front local
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
// En ligne, l'hébergeur passe par un proxy : sans ça, req.ip serait le même pour tout le monde (voir rateLimit.js)
app.set('trust proxy', 1);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/users', usersRouter);
app.use('/', petsRouter);

/*Connection du Back-end avec la base de donnes(MongoDB) (verifier le fichier(.env)*/
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB compass connecté'))
  .catch(err => console.error('Erreur connexion:', err));

module.exports = app;
