// Gestion de la session stockée dans le navigateur (token JWT + infos utilisateur)

// Renvoie le token s'il existe et n'est pas expiré, sinon vide la session et renvoie null
export function getValidToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        // la 2e partie du JWT contient la date d'expiration (exp, en secondes)
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            logout();
            return null;
        }
        return token;
    } catch {
        logout();
        return null;
    }
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

// Enregistre la session après une connexion (réponse du back-end : { token, user })
export function saveSession({ token, user }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}

// Utilisateur enregistré à la connexion (ou null)
export function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}
