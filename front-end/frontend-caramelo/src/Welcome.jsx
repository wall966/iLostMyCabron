import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import Card, { OngletsStatut } from './Card';
import SiteHeader, { SiteFooter } from './SiteHeader';
import carameloCourt from './assets/Caramelo_cour_1.png';
import { getValidToken } from './auth';
import { traduireEspece, traduireRace, traduireStatut } from './annonces';
import { usePreferences } from './preferences';
import { useTraductionAuto } from './i18n/traductionAuto';
import { Autocomplete } from '@mui/joy';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import './Site.css';
import { API_URL } from "./config";

// La liste déroulante de la recherche (MUI Joy) a son propre thème : on le cale sur celui du site
function ThemeJoy() {
    const { theme } = usePreferences();
    const { setMode } = useColorScheme();
    useEffect(() => {
        setMode(theme);
    }, [theme, setMode]);
    return null;
}

// Champs de la base de données proposés dans la recherche, avec leur titre de groupe
const CHAMPS_RECHERCHE = [
    { type: 'Name', cle: 'nom' },
    { type: 'Status', cle: 'statut' },
    { type: 'Species', cle: 'espece' },
    { type: 'Breed', cle: 'race' },
    { type: 'Chip_number', cle: 'puce' },
    { type: 'Description', cle: 'description' },
];

function Welcome() {
    const navigate = useNavigate();
    const { t } = usePreferences();
    const [filtrePet, setFiltrePet] = useState("tous");

    // Etats liés à la recherche, remontés depuis Cards.jsx
    const [animals, setAnimals] = useState([]);
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Récupère les animaux ici, pour que la barre de recherche du header ait accès aux options
    useEffect(() => {
        fetch(`${API_URL}/pets`)
            .then((response) => {
                if (!response.ok) throw new Error('Erreur lors de la récupération des données');
                return response.json();
            })
            .then((data) => setAnimals(data))
            .catch((err) => {
                console.error(err);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    // Race et description écrites par les utilisateurs : traduction automatique
    const traduit = useTraductionAuto(animals.flatMap((animal) => [animal.Breed, animal.Description]));

    // Texte affiché pour une option : statut et espèce via traductions.js, race et description traduites
    // automatiquement, nom et numéro de puce tels quels
    const libelle = (type, valeur) => {
        if (type === 'Status') return traduireStatut(t, valeur);
        if (type === 'Species') return traduireEspece(t, valeur);
        if (type === 'Breed') return traduireRace(t, valeur, traduit);
        if (type === 'Description') return traduit(valeur);
        return valeur;
    };

    // Construit les options de recherche à partir des animaux récupérés
    // value = valeur dans la base (sert au filtre), label = texte affiché dans la langue choisie
    const searchOptions = animals.flatMap((animal) =>
        CHAMPS_RECHERCHE.map(({ type }) => ({ type, value: animal[type], label: libelle(type, animal[type]) }))
    ).filter((opt) => opt.value).filter((opt, index, self) =>
        index === self.findIndex((o) => o.value === opt.value && o.type === opt.type)
    );

    const titreGroupe = (type) => t(`welcome.groupes.${CHAMPS_RECHERCHE.find((c) => c.type === type).cle}`);

    // Les formulaires demandent d'être connecté (compte ou invité)
    const posterAnnonce = (formulaire) => {
        navigate(getValidToken() ? formulaire : "/login");
    };

    return (
        <CssVarsProvider>
            <ThemeJoy />
            <div className='site-page'>
                <SiteHeader>
                    <Autocomplete
                        multiple
                        placeholder={t("welcome.recherche")}
                        options={searchOptions}
                        getOptionLabel={(option) => libelle(option.type, option.value)}
                        groupBy={(option) => titreGroupe(option.type)}
                        value={filters}
                        onChange={(event, newValue) => setFilters(newValue)}
                        isOptionEqualToValue={(option, value) =>
                            option.value === value.value && option.type === value.type
                        }
                    />
                </SiteHeader>

                <section className="wp-hero">
                    <div className="wp-hero-text">
                        <h1>{t("welcome.heroTitre")} <span className="c-orange">{t("welcome.heroTitreOrange")}</span></h1>
                        <p>{t("welcome.heroTexte")}</p>
                        <div className="wp-hero-actions">
                            <button type="button" className="wp-btn wp-btn-primary" onClick={() => posterAnnonce("/formperdu")}>
                                {t("welcome.btnPerdu")}
                            </button>
                            <button type="button" className="wp-btn wp-btn-secondary" onClick={() => posterAnnonce("/formtrouve")}>
                                {t("welcome.btnTrouve")}
                            </button>
                        </div>
                    </div>
                    <div className="wp-hero-art" aria-hidden="true">
                        <img src={carameloCourt} alt="" />
                    </div>
                </section>

                <main className="wp-content">
                    <div className="wp-section-head">
                        <h2>{t("welcome.dernieres")}</h2>
                        <OngletsStatut animals={animals} valeur={filtrePet} onChange={setFiltrePet} compteur />
                    </div>

                    {loading && <p className="wp-message">{t("welcome.chargement")}</p>}
                    {error && <p className="wp-message wp-message-error">{t("welcome.erreur")}</p>}
                    {!loading && !error && (
                        <Card filtre={filtrePet} animals={animals} filters={filters} />
                    )}
                </main>

                <SiteFooter />
            </div>
        </CssVarsProvider>
    )
}

export default Welcome;
