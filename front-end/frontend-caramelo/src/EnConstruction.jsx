import { Link } from "react-router";
import SiteHeader, { SiteFooter } from "./SiteHeader";
import { usePreferences } from "./preferences";
import "./Site.css";

// Page provisoire pour Contact et Services, en attendant leur contenu
// cleTitre = clé de traduction du titre (ex : "header.contact")
function EnConstruction({ cleTitre }) {
    const { t } = usePreferences();
    return (
        <div className="site-page">
            <SiteHeader />
            <main className="wp-content">
                <div className="wp-placeholder">
                    <h1>{t(cleTitre)}</h1>
                    <p>{t("construction.texte")}</p>
                    <Link to="/welcome" className="wp-btn wp-btn-secondary">{t("construction.retour")}</Link>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

export default EnConstruction;
