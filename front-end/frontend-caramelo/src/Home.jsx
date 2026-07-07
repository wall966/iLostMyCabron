import { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router';
import caramelo1 from './assets/Caramelo_cour_1.png';
import caramelo2 from './assets/Caramelo_cour_2.png';
import logoCaramelo from './assets/logo_cabron.jpg';

function Home() {
    const [frame, setFrame] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((current) => (current === 0 ? 1 : 0));
        }, 400);

        return () => clearInterval(interval);
    }, []);

    const currentImage = frame === 0 ? caramelo1 : caramelo2;
    const styleImage = {
        backgroundImage: `url(${currentImage})`,
    }
    const goToWelcome = () => {
        navigate('/welcome');
    };

    return (
        <div className="App">
            <header className="App-header"></header>

            <section className="hero-section">
                <div className="Caramelo_run" style={styleImage} alt="Logo Caramelo" />
                <img src={logoCaramelo} className="logo_welcome" alt="Logo Cabron" />
            </section>

            <article>
                <button className='welcomeButton' onClick={goToWelcome}>Bienvenue !!</button>
            </article>
        </div>
    );
}

export default Home;