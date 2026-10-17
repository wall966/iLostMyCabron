import "./Site.css";
import { Link } from "react-router";
import SiteHeader, { SiteFooter } from "./SiteHeader";
import { usePreferences } from "./preferences";
import logoCabron from "./assets/logo_cabron.jpg";

function About() {
   const { t } = usePreferences();

   return (
      <div className="site-page">
         <SiteHeader />

         <main className="wp-content about-page">
            {/* Introduction */}
            <section className="ab-intro">
               <div>
                  <h1>{t("about.titre")}</h1>
                  <p className="ab-lead">{t("about.intro1")}</p>
                  <p>
                     <strong>I Lost My Cabron</strong> {t("about.intro2")}
                  </p>
               </div>
               <img src={logoCabron} alt={t("about.logoAlt")} className="ab-logo" />
            </section>

            {/* Origine du nom */}
            <section className="ab-note">
               <h2>{t("about.nomTitre")}</h2>
               <p>{t("about.nom1")}</p>
               <p>{t("about.nom2")}</p>
            </section>

            {/* Fonctionnement */}
            <section className="ab-how">
               <h2>{t("about.commentTitre")}</h2>
               <div className="ab-columns">
                  <div className="ab-column ab-column-perdu">
                     <h3>{t("about.perduTitre")}</h3>
                     <p>{t("about.perduIntro")}</p>
                     <ul>
                        {t("about.perduListe").map((item) => <li key={item}>{item}</li>)}
                     </ul>
                     <p>{t("about.perduFin")}</p>
                  </div>
                  <div className="ab-column ab-column-trouve">
                     <h3>{t("about.trouveTitre")}</h3>
                     <p>{t("about.trouveIntro")}</p>
                     <ul>
                        {t("about.trouveListe").map((item) => <li key={item}>{item}</li>)}
                     </ul>
                  </div>
               </div>
            </section>

            {/* Ambition */}
            <section className="ab-next">
               <h2>{t("about.ambitionTitre")}</h2>
               <p>{t("about.ambitionTexte")}</p>
               <ol className="ab-list">
                  {t("about.ambitions").map((ambition) => (
                     <li key={ambition.titre}>
                        <strong>{ambition.titre}</strong>
                        <span>{ambition.texte}</span>
                     </li>
                  ))}
               </ol>
            </section>

            <section className="ab-cta">
               <p>{t("about.cta")}</p>
               <Link to="/welcome" className="wp-btn wp-btn-primary">{t("about.voirAnnonces")}</Link>
            </section>
         </main>

         <SiteFooter />
      </div>
   )
}

export default About;
