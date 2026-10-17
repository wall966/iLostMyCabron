import { useState, useEffect } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate, Link } from "react-router";
import { getValidToken, getStoredUser, logout } from "../auth";
import { usePreferences } from "../preferences";
import { API_URL } from "../config";

function Admin() {
    const navigate = useNavigate();
    const { t, tServeur, locale } = usePreferences();

    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = getValidToken();
    const administrator = Boolean(token) && getStoredUser()?.profile === "admin";

    // Charge la liste des utilisateurs au chargement de la page
    // (les messages d'erreur sont des clés de traduction, traduites à l'affichage)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data.users);
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.message || "admin.erreurChargement");
                } else {
                    setError("admin.erreurServeur");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm(t("admin.confirmSuppr"));
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // On retire l'utilisateur supprimé de la liste affichée, sans tout recharger
            setUsers(users.filter((u) => u._id !== userId));
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "admin.erreurSuppr");
            } else {
                setError("admin.erreurServeur");
            }
        }
    };
    if (!administrator) {
        return (
            <section className="admin-container">
                <p className="access-denied">{t("admin.refuse")}</p>
                <Link to="/welcome" className="admin-back">
                    {t("admin.retour")}
                </Link>
            </section>
        );
    }
    if (loading) return <p>{t("admin.chargement")}</p>;
    const handleLogout = () => {
        logout();
        navigate("/welcome");
    };
    return (
        <section className="admin-container">
            <Link to="/account" className="admin-back">
                {t("admin.retour")}
            </Link>
            <h2>{t("admin.titre")}</h2>

            {/* sorti du tableau : un bouton ne peut pas être directement dans un <tr> */}
            <button onClick={handleLogout} className="logout-button">
                {t("admin.seDeconnecter")}
            </button>

            {/* t() renvoie le texte tel quel si ce n'est pas une clé (message du serveur) */}
            {error && <p className="error-message">{tServeur(t(error))}</p>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>{t("admin.prenom")}</th>
                        <th>{t("admin.nom")}</th>
                        <th>{t("admin.email")}</th>
                        <th>{t("admin.profil")}</th>
                        <th>{t("admin.action")}</th>
                        <th>{t("admin.derniereConnexion")}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.firstname || "—"}</td>
                            <td>{user.surname || "—"}</td>
                            <td>{user.email || "—"}</td>
                            <td>{t(`compte.types.${user.profile}`)}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    {t("admin.supprimer")}
                                </button>
                            </td>
                            <td>{user.lastConnection ? new Date(user.lastConnection).toLocaleString(locale) : t("admin.jamais")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Admin;
