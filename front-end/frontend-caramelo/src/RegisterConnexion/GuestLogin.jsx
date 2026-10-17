import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { saveSession } from "../auth";
import { usePreferences } from "../preferences";
import "./Auth.css";
import { API_URL } from "../config";

function GuestLogin() {
    const navigate = useNavigate();
    const { t, tServeur } = usePreferences();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/users/guest-login`, { code });
            saveSession(response.data);
            navigate("/account");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
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
                <h2>{t("auth.codeTitre")}</h2>

                {error && <p className="error-message">{tServeur(error)}</p>}

                <input
                    type="text"
                    placeholder={t("auth.codePlaceholder")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={5}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? t("auth.connexion") : t("auth.continuer")}
                </button>

                <p className="auth-link">
                    <Link to="/guest">{t("auth.pasDeCode")}</Link>
                </p>
            </form>
        </section>
    );
}

export default GuestLogin;
