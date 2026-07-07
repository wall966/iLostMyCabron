import photoCabron from './assets/Photo_i_lost_my_cabron.jpg';
import animalWorld from './assets/world-animal-day.png'
import { Link, useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import logoCarameloDrk from './assets/logoCarameloDark.png';
import "./Account.css";
import axios from "axios";
import { Card, Accordion, Button, ListGroup } from 'react-bootstrap';

function Account() {
    const [listPets, setListPets] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [filtrePet, setFiltrePet] = useState("tous");
    const [displayCard, setDisplayCard] = useState(false);
    const [user, setUser] = useState(null);
    const [isDark, setIsDark] = useState(
        window.matchMedia('(prefers-color-scheme : dark)').matches
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/welcome");
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Êtes-vous sur de vouloir supprimer votre compte ? Cette action est irréversible.");
        if (!confirmed) return;
        try {
            const response = await fetch('http://localhost:3000/users/me', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert("Votre compte a été supprimé.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/welcome");
            } else {
                alert("Erreur : " + data.message);
            }
        } catch (error) {
            alert("Une erreur est survenue.");
        }
    };

    const handleDeletePet = async (id) => {
        const confirmed = window.confirm("Voulez-vous supprimer cette annonce ?");
        if (!confirmed) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/pets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListPets((prev) => prev.filter((pet) => pet._id !== id));
        } catch (error) {
            console.error("Erreur suppression:", error.response?.data || error.message);
            alert("Impossible de supprimer cette annonce.");
        }
    };

    const handleEditPet = (id) => {
        navigate(`/formperdu/${id}`);
    };

    // darkmode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme : dark)');
        const handleChange = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);

    }, []);

    useEffect(() => {
        const chercherPets = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/pets/mine", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setListPets(response.data);
            } catch (error) {
                console.error("Erreur:", error.response?.data || error.message);
            }
        };
        chercherPets();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Filtre les pets selon le statut choisi dans le menu (deja filtres par Owner via /pets/mine)
    const normalise = (str) => (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const petsFiltres = listPets.filter((pet) => {
        if (filtrePet === "tous") return true;
        return normalise(pet.Status) === normalise(filtrePet);
    });

    return (<>
        <div className='Welcome'>
            <header className="Top">

                {isDark ? (
                    <img src={logoCarameloDrk} className="logo_cabron_drk" alt="Logo Cabron dark" />
                ) : (
                    <img src={photoCabron} className="logo_cabron" alt="Logo Cabron" />
                )}

                <button type='button' className='menu' onClick={() => {
                    setMenuOpen(!menuOpen)
                }}>Menu</button>

                {/* Button pour donner acess aux deux formulaires perdu/trouve */}
                <ul className={`dropside-menu ${menuOpen ? "open" : ""}`}>
                    <li> <button
                        className="logout"
                        onClick={() => {
                            setDisplayCard(true);
                            setFiltrePet("tous");
                        }}
                    >
                            Voir tous les animaux
                        </button>
                    </li>
                    <li>
                        <button
                            className="logout"
                            onClick={() => {
                                setDisplayCard(true);
                                setFiltrePet("trouve");
                            }}
                        >
                            Voir tous les animaux trouvés
                        </button>
                    </li>
                    <li>
                        <button className="logout"
                            onClick={() => {
                                setDisplayCard(true);
                                setFiltrePet("perdu");
                            }}
                        > Voir tous les animaux perdus</button>
                    </li>

                    <li style={{ position: "relative" }}>
                        <button className="logout" onClick={() => setOpen(!open)} > Poster une annonce </button>
                    </li>
                    {open && (
                        <ul style={{ position: "absolute", left: "100%", top: 100, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <li>
                                <button className="logout" onClick={() => navigate("/FormPerdu")}>Animal perdu</button>
                            </li>
                            <hr style={{ width: "100%" }} />
                            <li>
                                <button className="logout" onClick={() => navigate("/FormTrouve")}>Animal trouvé </button>
                            </li>
                        </ul>
                    )}
                    <li>
                        <button className='logout' onClick={() => navigate("/account")}> Voir mes annonces</button>
                    </li>
                </ul>
                <br/>
                <section>
                    <ul className="navBarBtn">
                        <li>
                            <Link to="/about">A propos de nous</Link>
                        </li>
                        <li>
                            <Link to="/services">Services</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </section>

              

            </header>

            <aside>
                <img src={animalWorld} className="login" alt="Sign up / in" onClick={() => {
                    setLoginOpen(!loginOpen)
                }} />
                <ul className={`dropdown-login ${loginOpen ? "open" : ""}`}>
                    <li>
                        <button onClick={handleLogout} className="logout">Se deconnecter</button>
                    </li>
                    <li>
                        <button onClick={handleDeleteAccount} className="delete-account">Supprimer mon compte</button>
                    </li>
                </ul>
            </aside>

            <main className="account-content">
                {user && (
                <h1>
                    Bienvenue {user.firstname} !
                </h1>
                )}

                {petsFiltres.length === 0 ? (
                    <p className="no-annonce">Vous n'avez pas encore publié d'annonce..</p>
                ) : (
                    <div className="cards-row">
                        {petsFiltres.map((animal) => (
                            <Card className="animal-card" key={animal._id}>
                                <div className="card-img-wrapper">
                                    <Card.Img variant="top" src={animal.Photo} />
                                    <span className={`status-badge ${animal.Status === 'perdu' ? 'status-perdu' : 'status-trouve'}`}>
                                        {animal.Status}
                                    </span>
                                </div>
                                <Card.Body className="animal-card-body">
                                    <Card.Title>{animal.Name}</Card.Title>

                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>{animal.Breed}</ListGroup.Item>
                                        <ListGroup.Item>Date et heure : {animal.Date_time}</ListGroup.Item>
                                        <ListGroup.Item>Localisation : {animal.GPS_coordinates}</ListGroup.Item>
                                    </ListGroup>

                                    <Accordion className="mt-2">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Voir la description</Accordion.Header>
                                            <Accordion.Body>
                                                {animal.Description}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                  <div className="card-actions mt-2 d-flex gap-2">
                                    <button className="edit-pet" onClick={() => handleEditPet(animal._id)}>
                                        Modifier
                                    </button>
                                    <button className="delete-pet" onClick={() => handleDeletePet(animal._id)}>
                                        Supprimer
                                    </button>
                                </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

        </div>

    </>
    )
}

export default Account