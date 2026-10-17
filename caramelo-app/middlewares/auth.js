const jwt = require('jsonwebtoken');


//Vérifier le token authentique et valide
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
// verifie que le token commence par 'Bearer', erreur si ça manque
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: "Token manquant" });
    }
    // recupère le token sans espace après le Bearer
    const token = authHeader.split(' ')[1];

    try {
        // verifie le token par rapport a JWT_secret (.env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
}

// Infos utilisateur renvoyées au front (jamais le mot de passe)
function profilPublic(user) {
    return {
        id: user._id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        profile: user.profile,
        trackingCode: user.trackingCode
    };
}

// Crée le token de connexion (valable 7 jours) + les infos utilisateur.
// Utilisé par la connexion classique, invité et Google.
function creerSession(user) {
    const token = jwt.sign(
        { id: user._id, profile: user.profile },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    return { token, user: profilPublic(user) };
}

module.exports = authMiddleware;
module.exports.profilPublic = profilPublic;
module.exports.creerSession = creerSession;
