import photoCabron from './assets/Photo_i_lost_my_cabron.jpg';
import animalWorld from './assets/world-animal-day.png'
import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';
import logoCarameloDrk from './assets/logoCarameloDark.png';
import Button from 'react-bootstrap/Button';
import Card from './Card';
import { CardImg } from 'react-bootstrap';
import { Autocomplete, FormControl } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';

function Welcome() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [filtrePet, setFiltrePet] = useState("tous");
    const [isDark, setIsDark] = useState(
        window.matchMedia('(prefers-color-scheme : dark)').matches
    );

    // Etats liés à la recherche, remontés depuis Cards.jsx
    const [animals, setAnimals] = useState([]);
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme : dark)');
        const handleChange = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Récupère les animaux ici, pour que la barre de recherche du header ait accès aux options
    useEffect(() => {
        fetch('http://localhost:3000/pets')
            .then((response) => {
                if (!response.ok) throw new Error('Erreur lors de la récupération des données');
                return response.json();
            })
            .then((data) => setAnimals(data))
            .catch(console.error);
    }, []);

    // Construit les options de recherche à partir des animaux récupérés
        const searchOptions = animals.flatMap((animal) => [
            { label: animal.Name, type: 'Nom', value: animal.Name },
            { label: animal.Status, type: 'Statut', value: animal.Status },
            { label: animal.Species, type: 'Espèce', value: animal.Species },
            { label: animal.Breed, type: 'Race', value: animal.Breed },
            { label: animal.Chip_number, type: 'Numéro de puce', value: animal.Chip_number },
            { label: animal.Description, type: 'Description', value: animal.Description },
        ]).filter((opt) => opt.label).filter((opt, index, self) =>
            index === self.findIndex((o) => o.label === opt.label && o.type === opt.type)
        );
    return (<>
        <CssVarsProvider>
            <div className='Welcome'>
                <header className="Top">
                    {isDark ? (
                        <img src={logoCarameloDrk} className="logo_cabron_drk" alt="Logo Cabron dark" />
                    ) : (
                        <img src={photoCabron} className="logo_cabron" alt="Logo Cabron" />
                    )}

                    <button type='button' className='menu' onClick={() => setMenuOpen(!menuOpen)}>Menu</button>

                   <ul className={`dropside-menu ${menuOpen ? "open" : ""}`}>
                        <li
                            className={filtrePet === "perdu" ? "active" : ""}
                            onClick={() => {
                                setFiltrePet("perdu");
                                setMenuOpen(false);
                            }}
                        >
                            <button className="logout">Voir tous les animaux perdus</button>
                        </li>
                        <li
                            className={filtrePet === "trouvé" ? "active" : ""}
                            onClick={() => {
                                setFiltrePet("trouvé");
                                setMenuOpen(false);
                            }}
                        >
                            <button className="logout">Voir tous les animaux trouvés</button>
                        </li>
                        <li
                            className={filtrePet === "tous" ? "active" : ""}
                            onClick={() => {
                                setFiltrePet("tous");
                                setMenuOpen(false);
                            }}
                        >
                            <button className='logout'>Voir tous les animaux</button>
                        </li>
                    </ul>

                    <section>
                        <ul className='navBarBtn'>
                            <li><Link to="/about">A propos de nous</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </section>

                    {/* Remplace l'ancien input simple par l'Autocomplete complet */}
                    <FormControl id="multiple-limit-tags" className="search">
                        <Autocomplete
                            multiple
                            placeholder="Rechercher un animal..."
                            options={searchOptions}
                            getOptionLabel={(option) => option.label}
                            groupBy={(option) => option.type}
                            value={filters}
                            onChange={(event, newValue) => setFilters(newValue)}
                            isOptionEqualToValue={(option, value) =>
                                option.label === value.label && option.type === value.type
                            }
                            sx={{ width: '350px' }}
                        />
                    </FormControl>
                </header>

                <aside className="login-wrapper">
                    <img src={animalWorld} className="login" alt="Sign up / in" onClick={() => {
                        setLoginOpen(!loginOpen)
                    }} />
                    <ul className={`dropdown-login ${loginOpen ? "open" : ""}`}>
                        <li><Link to="/login">Se connecter</Link></li>
                        <li><Link to="/register">S'inscrire</Link></li>
                        <li><Link to="/guest">Compte invité</Link></li>
                    </ul>
                </aside>

                <Card filtre={filtrePet} animals={animals} filters={filters} />
            </div>
        </CssVarsProvider>
    </>)
}

export default Welcome;