import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import caramelo1 from './assets/Caramelo_cour_1.png';
import caramelo2 from './assets/Caramelo_cour_2.png';
import logoCaramelo from './assets/logo_cabron.jpg';
import logoCarameloDark from './assets/logoCarameloDark.png';
import { usePreferences } from './preferences';
import './Home.css';

function Home() {
    const [frame, setFrame] = useState(0);
    const navigate = useNavigate();
    const { isDark, t } = usePreferences();

    // Alterne les 2 images de Caramelo pour donner l'impression qu'il court
    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((current) => (current === 0 ? 1 : 0));
        }, 400);

        return () => clearInterval(interval);
    }, []);

    const currentImage = frame === 0 ? caramelo1 : caramelo2;

    return (
        <div className="home">
            <section className="home-hero">
                <div className="caramelo-run" style={{ backgroundImage: `url(${currentImage})` }} aria-hidden="true" />
                <img src={isDark ? logoCarameloDark : logoCaramelo} className="home-logo" alt={t("home.logoAlt")} />
            </section>

            <div className="home-actions">
                <button className="home-button" onClick={() => navigate('/welcome')}>{t("home.bienvenue")}</button>
            </div>
        </div>
    );
}

export default Home;
