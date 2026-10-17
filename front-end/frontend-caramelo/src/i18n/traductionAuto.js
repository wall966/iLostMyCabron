// Traduction automatique du contenu écrit par les utilisateurs (description, race...)
// Ces textes viennent de la base de données : ils ne peuvent pas être dans traductions.js
// On utilise l'API gratuite MyMemory (https://mymemory.translated.net), qui détecte toute seule la langue d'origine
import { useEffect, useState } from "react";
import { usePreferences } from "../preferences";

const CLE_STOCKAGE = "traductions-auto";
const TAILLE_MAX = 500; // limite de l'API MyMemory (au-delà, on garde le texte d'origine)

// Traductions déjà faites : "langue|texte" => traduction (gardées dans le navigateur pour ne pas redemander)
const cache = new Map(Object.entries(lireStockage()));
const enCours = new Map();

function lireStockage() {
    try { return JSON.parse(localStorage.getItem(CLE_STOCKAGE)) || {}; } catch { return {}; }
}

function sauverStockage() {
    try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(Object.fromEntries(cache))); } catch { /* pas grave */ }
}

// L'API renvoie parfois des caractères codés en HTML (&#39; pour ')
function decoderHtml(texte) {
    return new DOMParser().parseFromString(texte, "text/html").documentElement.textContent;
}

function traduire(texte, langue) {
    const cle = `${langue}|${texte}`;
    if (cache.has(cle)) return Promise.resolve(cache.get(cle));
    if (texte.length > TAILLE_MAX) return Promise.resolve(texte);

    // Si le même texte est déjà demandé (ex : 2 cartes identiques), on attend la même réponse
    if (!enCours.has(cle)) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texte)}&langpair=Autodetect|${langue}`;
        const requete = fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // 200 = traduit. "PLEASE SELECT TWO DISTINCT LANGUAGES" = le texte est déjà dans la bonne langue
                const dejaBonneLangue = String(data.responseDetails).includes("DISTINCT LANGUAGES");
                if (Number(data.responseStatus) === 200 && data.responseData?.translatedText) {
                    cache.set(cle, decoderHtml(data.responseData.translatedText));
                } else if (dejaBonneLangue) {
                    cache.set(cle, texte);
                } else {
                    return texte; // quota dépassé ou erreur : texte d'origine, on réessaiera plus tard
                }
                sauverStockage();
                return cache.get(cle);
            })
            .catch(() => texte)
            .finally(() => enCours.delete(cle));
        enCours.set(cle, requete);
    }
    return enCours.get(cle);
}

/* Traduit une liste de textes dans la langue choisie.
   Renvoie une fonction : traduit(texte) => traduction si elle est prête, sinon le texte d'origine */
export function useTraductionAuto(textes) {
    const { langue } = usePreferences();
    const [, setVersion] = useState(0);
    const aTraduire = [...new Set(textes.filter(Boolean))];
    const cleListe = aTraduire.join("\u0000");

    useEffect(() => {
        const manquants = cleListe.split("\u0000").filter((texte) => texte && !cache.has(`${langue}|${texte}`));
        if (manquants.length === 0) return;
        let actif = true;
        Promise.all(manquants.map((texte) => traduire(texte, langue)))
            .then(() => { if (actif) setVersion((v) => v + 1); });
        return () => { actif = false; };
    }, [cleListe, langue]);

    return (texte) => (texte ? cache.get(`${langue}|${texte}`) ?? texte : texte);
}
