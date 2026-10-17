// Adresse du back-end : variable VITE_API_URL du fichier .env (en ligne), sinon le serveur local
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
