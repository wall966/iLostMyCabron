// Fonctions utiles pour trier les annonces

// Ignore les accents et majuscules (la base de données utilise "trouvé")
export const normalise = (str) => (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Garde les annonces du statut choisi ("tous", "perdu" ou "trouvé")
export const filtrerParStatut = (animals, statut) => statut === "tous"
    ? animals
    : animals.filter((animal) => normalise(animal.Status) === normalise(statut));

// La base de données garde les valeurs en français ("chien", "perdu"...) : on les traduit seulement à l'affichage
// Une espèce absente des traductions est affichée telle quelle
export const traduireEspece = (t, espece) => {
    if (!espece) return espece;
    const cle = `especes.${normalise(espece)}`;
    const traduction = t(cle);
    return traduction === cle ? espece : traduction;
};

// Race : d'abord le dictionnaire de traductions.js (fiable), sinon la traduction automatique (traduitAuto)
export const traduireRace = (t, race, traduitAuto) => {
    if (!race) return race;
    const cle = `races.${normalise(race).trim()}`;
    const traduction = t(cle);
    return traduction === cle ? traduitAuto(race) : traduction;
};

export const traduireStatut = (t, statut) => {
    if (normalise(statut) === "perdu") return t("cartes.perdu");
    if (normalise(statut) === "trouve") return t("cartes.trouve");
    return statut;
};
