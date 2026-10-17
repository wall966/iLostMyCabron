// Limite le nombre de tentatives par adresse IP (en mémoire, remis à zéro au redémarrage du serveur)
// Sert à empêcher de tester tous les codes invités ou mots de passe à la chaîne
function rateLimit({ max, windowMs }) {
    const attempts = new Map();

    return function (req, res, next) {
        const now = Date.now();
        const entry = attempts.get(req.ip);

        if (!entry || now > entry.resetAt) {
            attempts.set(req.ip, { count: 1, resetAt: now + windowMs });
            return next();
        }
        entry.count++;
        if (entry.count > max) {
            return res.status(429).json({ message: "Trop de tentatives, réessayez dans quelques minutes" });
        }
        next();
    };
}

module.exports = rateLimit;
