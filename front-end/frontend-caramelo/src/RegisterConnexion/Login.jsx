import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import "./Login.css";
import cabron from "../assets/Photo_i_lost_my_cabron.jpg";
import LoginGoogle from "./LoginGoogle";
 
function Login() {
    // rediriger l'utilisateur :
    const navigate = useNavigate();
 
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
                "http://localhost:3000/users/login",
                formData
            );
           
            console.log("Utilisateur connecté:", response.data);
            // Stocke le token et les infos pour garder la session
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            //  Page de destination après connection
            if (response.data.user.profile === 'admin') {
                navigate("/admin");
            } else {
                navigate("/account");
            }
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
        <section className="login-container">
 
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Bienvenue</h2>
                {error && <p className="error-message">{error}</p>}
 
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
 
                <button type="submit" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
                <p className="connexionGoogle">ou</p>
                <LoginGoogle />
                <p className="login-link">
                    <Link to="/forgot-password">Mot de passe oublié ?</Link>
                </p>
                <p className="register-link">
                    Pas encore de compte? <Link to="/register">Créer un compte</Link>
                </p>
                <Link to="/welcome" className="link_to_welcome">
                    Retour à l'accueil
                </Link>
            </form>
        </section>
    );
}
export default Login;