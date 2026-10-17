const express = require('express');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { creerSession } = require('../middlewares/auth');
const User = require('../models/usersJSON');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Route pour la connexion avec google
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleID, email, given_name, family_name, name } = payload;

        let user = await User.findOne({ googleID });
        if (!user && email) {
            // Compte déjà créé avec le même email : on le relie à Google au lieu d'en créer un 2e
            user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                user.googleID = googleID;
            }
        }
        if (!user) {
            user = new User({
                googleID,
                email,
                firstname: given_name || name,
                surname: family_name || '',
                profile: 'utilisateur',
                // mot de passe aléatoire (non utilisable), le compte se connecte via Google
                password: crypto.randomBytes(32).toString('hex'),
            });
        }
        user.lastConnection = new Date();
        await user.save();

        // Même token et mêmes infos que la connexion classique
        res.json(creerSession(user));
    } catch (err) {
        console.error('erreur détaillée:', err.message);
        res.status(401).json({ error: 'Authentification Google invalide' });
    }
});

module.exports = router;
