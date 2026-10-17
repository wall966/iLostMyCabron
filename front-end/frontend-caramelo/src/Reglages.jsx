// Choix de la langue (FR / EN / PT-BR) + bouton mode clair / sombre
// Dans le header du site, ou en haut à droite (flottant) sur les pages sans header
import { useLocation } from "react-router";
import { usePreferences } from "./preferences";
import { LANGUES } from "./i18n/traductions";
import "./Reglages.css";

function Reglages({ flottant = false }) {
    const { isDark, basculerTheme, langue, setLangue, t } = usePreferences();
    const texteTheme = isDark ? t("reglages.modeClair") : t("reglages.modeSombre");

    return (
        <div className={`reglages ${flottant ? "reglages-flottant" : ""}`}>
            <ul className="reglages-langues" aria-label={t("reglages.langue")}>
                {LANGUES.map((l) => (
                    <li key={l.code}>
                        <button
                            type="button"
                            lang={l.code}
                            title={l.nom}
                            aria-pressed={langue === l.code}
                            onClick={() => setLangue(l.code)}
                        >
                            {l.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* on affiche l'icône du mode vers lequel on peut passer */}
            <button type="button" className="reglages-theme" onClick={basculerTheme} aria-label={texteTheme} title={texteTheme}>
                {isDark ? (
                    <svg className="reglages-icone" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </svg>
                ) : (
                    <svg className="reglages-icone" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
                    </svg>
                )}
            </button>
        </div>
    );
}

// Pages qui ont déjà les réglages dans leur header (SiteHeader)
const PAGES_AVEC_HEADER = ["/welcome", "/about", "/services", "/contact", "/account"];

// Affiche les réglages flottants seulement sur les autres pages (intro, connexion, formulaires, admin)
export function ReglagesFlottants() {
    const { pathname } = useLocation();
    if (PAGES_AVEC_HEADER.includes(pathname)) return null;
    return <Reglages flottant />;
}

export default Reglages;
