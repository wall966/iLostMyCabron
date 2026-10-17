import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { saveSession } from "../auth";
import { usePreferences } from "../preferences";
import "./Auth.css";
import LoginGoogle from "./LoginGoogle";
import { API_URL } from "../config";

function Login() {
    // rediriger l'utilisateur :
    const navigate = useNavigate();
    const { t, tServeur } = usePreferences();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
                `${API_URL}/users/login`,
                formData
            );

            console.log("Utilisateur connecté:", response.data);
            // Stocke le token et les infos pour garder la session
            saveSession(response.data);
            //  Page de destination après connection
            if (response.data.user.profile === 'admin') {
                navigate("/admin");
            } else {
                navigate("/account");
            }
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
                    placeholder={t("auth.motDePasse")}
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? t("auth.connexion") : t("auth.seConnecter")}
                </button>
                <p className="auth-or">{t("auth.ou")}</p>
                <LoginGoogle />
                <p className="auth-link">
                    <Link to="/forgot-password">{t("auth.mdpOublie")}</Link>
                </p>
                <p className="auth-link">
                    {t("auth.pasDeCompte")} <Link to="/register">{t("auth.creerCompte")}</Link>
                </p>
                <p className="auth-link">
                    <Link to="/welcome">{t("auth.retourAccueil")}</Link>
                </p>
            </form>
        </section>
    );
}
export default Login;
