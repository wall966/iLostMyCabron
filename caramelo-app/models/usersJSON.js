// Schema pour un nouvel utilisateur ou un utilisateur qui se connecte : 

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({

    profile: {
        type: String,
        enum: ['utilisateur', 'admin', 'anonyme'],
        required: true
    },
    surname: {
        type: String,
        required: function () {
            return this.profile !== 'anonyme';
        }
    },
    firstname: {
        type: String,
        required: function () {
            return this.profile !== 'anonyme';
        }
    },

    email: {
        type: String,
        required: function () {
            return this.profile !== 'anonyme';
        },
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Format d'email invalide"]
    },
    password: {
        type: String,
        required: function () {
            return this.profile !== 'anonyme';
        },
    },
    phone_number: {
        type: String
        // String plutot que number pour que le 1er 0 soit pris en compte
    },
    creation_date: {
        type: Date,
        default: Date.now
        // format Fr a faire dans le front-end seulement
    },
    // Afficher la dernière connexion des utilisateurs
    lastConnection: {
        type: Date,
        default: null
    },
    // Pour mot de passe oublié
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    // code que l'utilsateur invité (anonyme) visualise pour suivre ses annonces
    trackingCode: {
        type: String,
        unique: true,
        sparse: true
    },
    googleID: {
        type: String,
        unique: true
    }
},
    // Permet de ne pas afficher --v : 0 dans mongoDB
    { versionKey: false });


// Hook executé avant chaque sauvegarde : 
UserSchema.pre('save', async function () {
    // mot de passe hashe seulement si il a été modifié ou créé 
    if (!this.isModified('password') || !this.password) {
        return;
    }
    // génère un "sel" aléatoire (le 10 est le nombre de tours de calcul 
    // plus il est élevé, plus c'est sécurisé mais plus c'est lent ; 10 est un bon compromis standard):

    const salt = await bcrypt.genSalt(10);
    // transforme le mot de passe en clair en une chaîne hashée irréversible:
    this.password = await bcrypt.hash(this.password, salt);
});

// Vérifier le mot de passe à la connexion
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


const Users = mongoose.model('Users', UserSchema);
module.exports = Users;