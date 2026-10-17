import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { usePreferences } from "../preferences";
import "./Auth.css";
import { API_URL } from "../config";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { t, tServeur } = usePreferences();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/users/reset-password/${token}`,
                { password }
            );
            setSuccess(response.data.message);
            setTimeout(() => navigate("/login"), 2000);
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
                <h2>{t("auth.resetTitre")}</h2>

                {success && <p className="success-message">{tServeur(success)}</p>}
                {error && <p className="error-message">{tServeur(error)}</p>}

                <input
                    type="password"
                    placeholder={t("auth.nouveauMdp")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? t("auth.reinitialisation") : t("auth.reinitialiser")}
                </button>

                <p className="auth-link">
                    <Link to="/login">{t("auth.retourConnexion")}</Link>
                </p>
            </form>
        </section>
    );
}
export default ResetPassword
