import photoCabron from './assets/Photo_i_lost_my_cabron.jpg';
import animalWorld from './assets/world-animal-day.png';
import logoCarameloDrk from './assets/logoCarameloDark.png';
import { Link, NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { getValidToken, logout } from './auth';
import { usePreferences } from './preferences';
import Reglages from './Reglages';

// Header commun aux pages accueil, compte et à propos. "children" = contenu optionnel au centre (ex : barre de recherche)
function SiteHeader({ children }) {
    const navigate = useNavigate();
    const { isDark, t } = usePreferences();
    const [menuOpen, setMenuOpen] = useState(false);
    const isConnected = Boolean(getValidToken());

    const handleLogout = () => {
        logout();
        navigate("/welcome");
    };

    return (
        <header className="wp-header">
            <Link to="/welcome" className="wp-brand">
                <img
                    src={isDark ? logoCarameloDrk : photoCabron}
                    className="wp-logo"
                    alt=""
                />

                <span className="wp-brand-name">
                    I Lost My <span className="c-orange">Cabron</span>
                </span>
            </Link>

            <nav className="wp-nav">
                <NavLink to="/about">{t("header.about")}</NavLink>
                <NavLink to="/services">{t("header.services")}</NavLink>
                <NavLink to="/contact">{t("header.contact")}</NavLink>
            </nav>

            {children ? <div className="wp-search">{children}</div> : <div className="wp-spacer" />}

            {/* langue + mode clair / sombre */}
            <Reglages />

            <div className="wp-login">
                <button
                    type="button"
                    className="wp-account-btn"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <img src={animalWorld} alt="" />
                    {isConnected ? t("header.monCompte") : t("header.seConnecter")}
                </button>
                <ul className={`wp-login-menu ${menuOpen ? "open" : ""}`}>
                    {isConnected ? (
                        <>
                            <li><Link to="/account">{t("header.mesAnnonces")}</Link></li>
                            <li><button type="button" onClick={handleLogout}>{t("header.seDeconnecter")}</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">{t("header.seConnecter")}</Link></li>
                            <li><Link to="/register">{t("header.creerCompte")}</Link></li>
                            <li><Link to="/guest">{t("header.continuerInvite")}</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}

export function SiteFooter() {
    const { t } = usePreferences();
    return (
        <footer className="wp-footer">
            I Lost My Cabron · {t("footer")}
        </footer>
    );
}

export default SiteHeader;
