import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { saveSession } from "../auth";
import { usePreferences } from "../preferences";
import "./Auth.css";
import { API_URL } from "../config";

function Guest() {
    const navigate = useNavigate();
    const { t } = usePreferences();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [trackingCode, setTrackingCode] = useState(null);


    const handleGuestLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/users/guest`);
            saveSession(response.data);
            setTrackingCode(response.data.user.trackingCode);
        } catch {
            setError(t("auth.inviteErreur"));
        } finally {
            setLoading(false);
        }
    };

    // Affichage du code généré
    if (trackingCode) {
        return (
            <section className="auth-page">
                <div className="auth-box">
                    <h2>{t("auth.inviteCodeTitre")}</h2>
                    <p>{t("auth.inviteNotez")}</p>
                    <p className="tracking-code">{trackingCode}</p>
                    <button onClick={() => navigate("/account")}>
                        {t("auth.inviteNote")}
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="auth-page">

            <div className="auth-box">
                <h2>{t("auth.inviteTitre")}</h2>
                <p>{t("auth.inviteTexte")}</p>

                {error && <p className="error-message">{error}</p>}

                <button onClick={handleGuestLogin} disabled={loading}>
                    {loading ? t("auth.creation") : t("auth.inviteBouton")}
                </button>

                <p className="auth-link">
                    {t("auth.inviteVraiCompte")} <Link to="/register">{t("auth.sInscrire")}</Link>
                </p>
                <p className="auth-link">
                    {t("auth.inviteDejaCode")} <Link to="/guest-login">{t("auth.inviteSaisir")}</Link>
                </p>
                <p className="auth-link">
                    <Link to="/welcome">{t("auth.retourAccueil")}</Link>
                </p>
            </div>
        </section>
    );
}

export default Guest;
