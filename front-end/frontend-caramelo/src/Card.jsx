import { useState } from "react";
import { filtrerParStatut, normalise, traduireEspece, traduireRace } from "./annonces";
import { usePreferences } from "./preferences";
import { useTraductionAuto } from "./i18n/traductionAuto";

const ONGLETS = [
    { valeur: "tous", cle: "cartes.tous" },
    { valeur: "perdu", cle: "cartes.perdus" },
    { valeur: "trouvé", cle: "cartes.trouves" },
];

// Onglets Tous / Perdus / Trouvés, avec le nombre d'annonces si "compteur" est activé
export function OngletsStatut({ animals, valeur, onChange, compteur = false }) {
    const { t } = usePreferences();
    return (
        <div className="wp-tabs" role="tablist">
            {ONGLETS.map((onglet) => (
                <button
                    key={onglet.valeur}
                    type="button"
                    role="tab"
                    aria-selected={valeur === onglet.valeur}
                    className={`wp-tab ${valeur === onglet.valeur ? "active" : ""}`}
                    onClick={() => onChange(onglet.valeur)}
                >
                    {t(onglet.cle)}
                    {compteur && <span className="wp-tab-count">{filtrerParStatut(animals, onglet.valeur).length}</span>}
                </button>
            ))}
        </div>
    );
}

// Carte d'une annonce : photo avec badge perdu/trouvé, puis les infos
// "children" = boutons optionnels sous la carte (ex : Modifier / Supprimer dans la page compte)
export function AnimalCard({ animal, children }) {
    const { t } = usePreferences();
    // race et description sont écrites par l'utilisateur : traduction automatique
    const traduit = useTraductionAuto([animal.Breed, animal.Description]);
    const [voirOriginal, setVoirOriginal] = useState(false);
    const isPerdu = normalise(animal.Status) === "perdu";
    const espece = [traduireEspece(t, animal.Species), traduireRace(t, animal.Breed, traduit)].filter(Boolean).join(" · ");
    const description = traduit(animal.Description);
    const estTraduite = description !== animal.Description;

    return (
        <article className="ac-card">
            <div className="ac-photo">
                {animal.Photo
                    ? <img src={animal.Photo} alt={animal.Name || t("cartes.photoAlt")} />
                    : <span className="ac-no-photo">{t("cartes.pasDePhoto")}</span>}
                <span className={`ac-badge ${isPerdu ? "ac-badge-perdu" : "ac-badge-trouve"}`}>
                    {isPerdu ? t("cartes.perdu") : t("cartes.trouve")}
                </span>
            </div>

            <div className="ac-body">
                <h3>{animal.Name || t("cartes.nomInconnu")}</h3>
                <ul className="ac-infos">
                    <li>{espece || t("cartes.especeInconnue")}</li>
                    <li>{isPerdu ? t("cartes.disparuLe") : t("cartes.trouveLe")} {animal.Date_time || "—"}</li>
                    <li>{animal.GPS_coordinates || t("cartes.lieuInconnu")}</li>
                </ul>
                {animal.Description && (
                    <details className="ac-desc">
                        <summary>{t("cartes.voirDescription")}</summary>
                        <p>{voirOriginal ? animal.Description : description}</p>
                        {estTraduite && (
                            <p className="ac-trad">
                                {t("cartes.traductionAuto")} ·{" "}
                                <button type="button" onClick={() => setVoirOriginal(!voirOriginal)}>
                                    {voirOriginal ? t("cartes.voirTraduction") : t("cartes.voirOriginal")}
                                </button>
                            </p>
                        )}
                    </details>
                )}
                {children && <div className="ac-actions">{children}</div>}
            </div>
        </article>
    );
}

function Cards({ filtre, animals, filters }) {
    const { t } = usePreferences();

    // Filtre par statut (onglets) puis par la barre de recherche (venant du Welcome.jsx)
    // f.type = nom du champ de la base de données (Name, Status, Species...)
    const filteredAnimals = filtrerParStatut(animals, filtre).filter((animal) => {
        return filters.every((f) => animal[f.type] === f.value);
    });

    if (filteredAnimals.length === 0) {
        return (
            <div className="cards-empty">
                <p>{t("cartes.aucune")}</p>
            </div>
        );
    }

    return (
        <div className="cards-layout">
            <div className='cards-row'>
                {filteredAnimals.map((animal) => (
                    <AnimalCard key={animal._id} animal={animal} />
                ))}
            </div>
        </div>
    );
}

export default Cards;
