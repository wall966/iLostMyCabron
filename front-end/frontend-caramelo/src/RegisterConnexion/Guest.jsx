import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import "./Guest.css";
 
function Guest() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [trackingCode, setTrackingCode] = useState(null);
 
 
    const handleGuestLogin = async () => {
        setError("");
        setLoading(true);
 
        try {
            const response = await axios.post("http://localhost:3000/users/guest");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setTrackingCode(response.data.user.trackingCode);
        } catch (err) {
            setError("Impossible de créer un compte invité");
        } finally {
            setLoading(false);
        }
    };
 
    // Affichage du code généré
    if (trackingCode) {
        return (
            <section className="guest-container">
                <div className="guest-box">
                    <h2>Votre code de suivi</h2>
                    <p>Notez bien ce code, il vous permettra de retrouver vos annonces :</p>
                    <p className="tracking-code">{trackingCode}</p>
                    <button onClick={() => navigate("/account")}>
                        J'ai noté mon code, continuer
                    </button>
                </div>
            </section>
        );
    }
 
    return (
        <section className="guest-container">
 
            <div className="guest-box">
                <h2>Continuer en tant qu'invité</h2>
                <p>
                    Tu pourras poster des annonces de façon anonyme, sans créer de compte.
                </p>
 
                {error && <p className="error-message">{error}</p>}
 
                <button onClick={handleGuestLogin} disabled={loading}>
                    {loading ? "Création..." : "Continuer en invité"}
                </button>
 
                <p className="login-link">
                    Tu préfères un vrai compte ? <Link to="/register">S'inscrire</Link>
                </p>
                <p className="login-link">
                    Tu as déjà un code de suivi ? <Link to="/guest-login">Le saisir</Link>
                </p>
                <Link to="/welcome" className="link_to_welcome">
                    Retour à l'accueil
                </Link>
            </div>
        </section>
    );
}
 
export default Guest;