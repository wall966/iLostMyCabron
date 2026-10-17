import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import axios from "axios";
import SiteHeader, { SiteFooter } from './SiteHeader';
import { AnimalCard, OngletsStatut } from './Card';
import { normalise, filtrerParStatut } from './annonces';
import { getValidToken, logout } from './auth';
import { usePreferences } from './preferences';
import "./Site.css";
import { API_URL } from "./config";

function Account() {
    const navigate = useNavigate();
    const { t, tServeur, locale } = usePreferences();
    const [listPets, setListPets] = useState([]);
    const [filtrePet, setFiltrePet] = useState("tous");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Au chargement : on vérifie le token auprès du serveur avant d'afficher quoi que ce soit
    useEffect(() => {
        const token = getValidToken();
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        const chargerCompte = async () => {
            try {
                const [userResponse, petsResponse] = await Promise.all([
                    axios.get(`${API_URL}/users/me`, { headers }),
                    axios.get(`${API_URL}/pets/mine`, { headers }),
                ]);
                setUser(userResponse.data.user);
                setListPets(petsResponse.data);
            } catch (error) {
                console.error("Erreur:", error.response?.data || error.message);
                // 401 = token refusé, 404 = compte supprimé : la session n'est plus valable
                if ([401, 404].includes(error.response?.status)) {
                    logout();
                    navigate("/login", { replace: true });
                }
            } finally {
                setLoading(false);
            }
        };
        chargerCompte();
    }, [navigate]);

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(t("compte.confirmSupprCompte"));
        if (!confirmed) return;
        try {
            await axios.delete(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${getValidToken()}` }
            });
            alert(t("compte.compteSupprime"));
            logout();
            navigate("/welcome");
        } catch (error) {
            alert(t("compte.erreur") + (tServeur(error.response?.data?.message) || t("compte.erreurGenerique")));
        }
    };

    const handleDeletePet = async (id) => {
        const confirmed = window.confirm(t("compte.confirmSupprAnnonce"));
        if (!confirmed) return;
        try {
            await axios.delete(`${API_URL}/pets/${id}`, {
                headers: { Authorization: `Bearer ${getValidToken()}` }
            });
            setListPets((prev) => prev.filter((pet) => pet._id !== id));
        } catch (error) {
            console.error("Erreur suppression:", error.response?.data || error.message);
            alert(t("compte.impossibleSuppr"));
        }
    };

    // Ouvre le bon formulaire selon le statut, sinon un animal trouvé repasserait en "perdu"
    const handleEditPet = (pet) => {
        const formulaire = normalise(pet.Status) === "trouve" ? "formtrouve" : "formperdu";
        navigate(`/${formulaire}/${pet._id}`);
    };

    // Filtre les pets selon l'onglet choisi (deja filtres par Owner via /pets/mine)
    const petsFiltres = filtrerParStatut(listPets, filtrePet);

    if (loading || !user) {
        return (
            <div className="site-page">
                <SiteHeader />
                <p className="wp-message">{t("compte.chargement")}</p>
            </div>
        );
    }

    const isGuest = user.profile === "anonyme";
    const nomComplet = `${user.firstname || ""} ${user.surname || ""}`.trim();
    const initiale = isGuest ? "?" : (user.firstname || "?").charAt(0).toUpperCase();
    const typeCompte = t(`compte.types.${user.profile}`);

    return (
        <div className="site-page">
            <SiteHeader />

            <main className="wp-content account-page">
                {/* Fiche membre */}
                <aside className="acc-card">
                    <div className="acc-card-body">
                        <div className="acc-card-id">
                            <div className="acc-avatar" aria-hidden="true">{initiale}</div>
                            <div>
                                <p className="acc-name">{isGuest ? t("compte.bienvenue") : t("compte.bonjour", { nom: user.firstname })}</p>
                                <p className="acc-type">{typeCompte}</p>
                            </div>
                        </div>

                        <dl className="acc-fields">
                            {!isGuest && (
                                <div><dt>{t("compte.nom")}</dt><dd>{nomComplet}</dd></div>
                            )}
                            {user.email && (
                                <div><dt>{t("compte.email")}</dt><dd>{user.email}</dd></div>
                            )}
                            {user.phone_number && (
                                <div><dt>{t("compte.telephone")}</dt><dd>{user.phone_number}</dd></div>
                            )}
                            {user.creation_date && (
                                <div><dt>{t("compte.inscritLe")}</dt><dd>{new Date(user.creation_date).toLocaleDateString(locale)}</dd></div>
                            )}
                            <div><dt>{t("compte.annonces")}</dt><dd>{listPets.length}</dd></div>
                        </dl>

                        {isGuest && user.trackingCode && (
                            <div className="acc-tracking">
                                <span>{t("compte.codeSuivi")}</span>
                                <strong>{user.trackingCode}</strong>
                                <small>{t("compte.notezLe")}</small>
                            </div>
                        )}

                        {user.profile === "admin" && (
                            <Link to="/admin" className="acc-link">{t("compte.espaceAdmin")}</Link>
                        )}
                    </div>
                    <button type="button" className="acc-delete" onClick={handleDeleteAccount}>
                        {t("compte.supprimerCompte")}
                    </button>
                </aside>

                {/* Mes annonces */}
                <section className="acc-section">
                    <div className="wp-section-head">
                        <h1>{t("compte.mesAnnonces")}</h1>
                        <div className="acc-section-actions">
                            <button type="button" className="wp-btn wp-btn-primary" onClick={() => navigate("/formperdu")}>
                                {t("compte.plusPerdu")}
                            </button>
                            <button type="button" className="wp-btn wp-btn-secondary" onClick={() => navigate("/formtrouve")}>
                                {t("compte.plusTrouve")}
                            </button>
                        </div>
                    </div>

                    {listPets.length > 0 && (
                        <div className="acc-tabs">
                            <OngletsStatut valeur={filtrePet} onChange={setFiltrePet} />
                        </div>
                    )}

                    {petsFiltres.length === 0 ? (
                        <div className="cards-empty">
                            <p>
                                {listPets.length === 0
                                    ? t("compte.aucunePubliee")
                                    : t("compte.aucuneCategorie")}
                            </p>
                        </div>
                    ) : (
                        <div className="cards-row">
                            {petsFiltres.map((animal) => (
                                <AnimalCard key={animal._id} animal={animal}>
                                    <button className="acc-card-btn" onClick={() => handleEditPet(animal)}>
                                        {t("compte.modifier")}
                                    </button>
                                    <button className="acc-card-btn acc-card-btn-danger" onClick={() => handleDeletePet(animal._id)}>
                                        {t("compte.supprimer")}
                                    </button>
                                </AnimalCard>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}

export default Account;
