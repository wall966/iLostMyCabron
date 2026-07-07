import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import "./Register.css";
import LoginGoogle from "./LoginGoogle";
 
function Register() {
    // rediriger l'utilisateur :
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(
        window.matchMedia('(prefers-color-scheme : dark)').matches
    );
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
                "http://localhost:3000/users/register",
                formData
            );
            console.log("Utilisateur créé:", response.data);
            navigate("/login");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Une erreur est survenue");
            } else {
                setError("Impossible de contacter le serveur");
            }
        } finally {
            setLoading(false);
        }
    };
 
 
    return (
        <section className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Bienvenu</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    name="firstname"
                    placeholder="Prénom"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="surname"
                    placeholder="Nom"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone_number"
                    placeholder="Numéro de téléphone"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />
 
                <button type="submit" disabled={loading}>
                    {loading ? "Création..." : "S'inscrire"}
                </button>
                <p className="connexionGoogle">ou</p>
                <LoginGoogle />
                <p className="login-link">
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                </p>
                     
                <p className="guest-link">
                    Continuer avec un compte invité ? <Link to="/guest">Compte invité</Link>
                </p>
                <Link to="/welcome" className="link_to_welcome">
                    Retour à l'accueil
                </Link>
            </form>
        </section>
    );
}
export default Register;