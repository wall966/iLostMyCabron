// Préférences du visiteur : thème (clair / sombre) et langue (fr / en / pt-BR)
// Elles sont gardées dans le navigateur (localStorage) pour rester les mêmes d'une visite à l'autre
import { createContext, useContext, useEffect, useState } from "react";
import { LANGUES, TRADUCTIONS, MESSAGES_SERVEUR } from "./i18n/traductions";

const PreferencesContext = createContext(null);

// localStorage peut être bloqué (navigation privée) : on ne veut pas que le site plante pour ça
const lire = (cle) => {
    try { return localStorage.getItem(cle); } catch { return null; }
};
const ecrire = (cle, valeur) => {
    try { localStorage.setItem(cle, valeur); } catch { /* préférence non sauvegardée, tant pis */ }
};

// Première visite : on suit le réglage de l'ordinateur
const themeDeDepart = () => {
    const sauve = lire("theme");
    if (sauve === "light" || sauve === "dark") return sauve;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Première visite : on prend la langue du navigateur si on la propose, sinon le français
const langueDeDepart = () => {
    const sauvee = lire("langue");
    if (TRADUCTIONS[sauvee]) return sauvee;
    const navigateur = (navigator.language || "fr").toLowerCase();
    if (navigateur.startsWith("pt")) return "pt-BR";
    if (navigateur.startsWith("en")) return "en";
    return "fr";
};

// Va chercher "cle.sous_cle" dans l'objet de traductions
const chercher = (objet, cle) => cle.split(".").reduce((valeur, morceau) => valeur?.[morceau], objet);

export function PreferencesProvider({ children }) {
    const [theme, setTheme] = useState(themeDeDepart);
    const [langue, setLangue] = useState(langueDeDepart);

    // data-theme sur <html> : c'est lui qui active les couleurs sombres dans les fichiers CSS
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        ecrire("theme", theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = langue;
        ecrire("langue", langue);
    }, [langue]);

    // t("header.about") => "À propos" / "About" / "Sobre"
    // Si un texte manque dans une langue, on affiche la version française
    const t = (cle, valeurs = {}) => {
        const texte = chercher(TRADUCTIONS[langue], cle) ?? chercher(TRADUCTIONS.fr, cle) ?? cle;
        if (typeof texte !== "string") return texte;
        return texte.replace(/\{(\w+)\}/g, (_, nom) => valeurs[nom] ?? "");
    };

    // Message renvoyé par le back-end (en français) => traduit s'il est connu, sinon tel quel
    const tServeur = (message) => MESSAGES_SERVEUR[langue]?.[message] ?? message;

    const infosLangue = LANGUES.find((l) => l.code === langue);

    const valeur = {
        theme,
        isDark: theme === "dark",
        basculerTheme: () => setTheme((actuel) => (actuel === "dark" ? "light" : "dark")),
        langue,
        setLangue,
        locale: infosLangue.locale,       // pour les dates : toLocaleDateString(locale)
        localeDayjs: infosLangue.dayjs,   // pour le calendrier des formulaires
        t,
        tServeur,
    };

    return <PreferencesContext.Provider value={valeur}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
    return useContext(PreferencesContext);
}
