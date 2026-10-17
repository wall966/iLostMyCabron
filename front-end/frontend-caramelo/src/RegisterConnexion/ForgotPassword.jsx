import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { usePreferences } from "../preferences";
import "./Auth.css";
import { API_URL } from "../config";

function ForgotPassword() {
    const { t, tServeur } = usePreferences();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/users/forgot-password`,
                { email }
            );
            setMessage(response.data.message);
        } catch {
            setError(t("auth.erreurServeur"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-page">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>{t("auth.oublieTitre")}</h2>

                {message && <p className="success-message">{tServeur(message)}</p>}
                {error && <p className="error-message">{tServeur(error)}</p>}

                <input
                    type="email"
                    placeholder={t("auth.votreEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? t("auth.envoi") : t("auth.envoyerLien")}
                </button>

                <p className="auth-link">
                    <Link to="/login">{t("auth.retourConnexion")}</Link>
                </p>
            </form>
        </section>
    );
}
export default ForgotPassword
