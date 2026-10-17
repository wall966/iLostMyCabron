import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { usePreferences } from "../preferences";
import "./Auth.css";
import LoginGoogle from "./LoginGoogle";
import { API_URL } from "../config";

function Register() {
    // rediriger l'utilisateur :
    const navigate = useNavigate();
    const { t, tServeur } = usePreferences();
    const [formData, setFormData] = useState({
        surname: "",
        firstname: "",
        email: "",
        password: "",
        phone_number: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/users/register`,
                formData
            );
            console.log("Utilisateur créé:", response.data);
            navigate("/login");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || t("auth.erreurGenerique"));
            } else {
                setError(t("auth.erreurServeur"));
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="auth-page">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>{t("auth.bienvenue")}</h2>
                {error && <p className="error-message">{tServeur(error)}</p>}
                <input
                    type="text"
                    name="firstname"
                    placeholder={t("auth.prenom")}
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="surname"
                    placeholder={t("auth.nom")}
                    value={formData.surname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder={t("auth.email")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder={t("auth.mdpMin")}
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                />
                <input
                    type="tel"
                    name="phone_number"
                    placeholder={t("auth.telephone")}
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? t("auth.creation") : t("auth.sInscrire")}
                </button>
                <p className="auth-or">{t("auth.ou")}</p>
                <LoginGoogle />
                <p className="auth-link">
                    {t("auth.dejaCompte")} <Link to="/login">{t("auth.seConnecter")}</Link>
                </p>

                <p className="auth-link">
                    {t("auth.continuerInvite")} <Link to="/guest">{t("auth.compteInvite")}</Link>
                </p>
                <p className="auth-link">
                    <Link to="/welcome">{t("auth.retourAccueil")}</Link>
                </p>
            </form>
        </section>
    );
}
export default Register;
