import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { saveSession } from '../auth';
import { useNavigate } from 'react-router';
import { usePreferences } from '../preferences';
import { API_URL } from "../config";

function LoginGoogle() {
    const navigate = useNavigate();
    // le bouton Google suit la langue et le thème du site
    const { langue, isDark } = usePreferences();
    const handleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/google`, {
                token: credentialResponse.credential,
            });
            saveSession(res.data);
            navigate('/account');
        } catch (err) {
            console.error('Erreur de connexion Google:', err);
        }
    };

    return (
        <GoogleLogin
            key={`${langue}-${isDark}`}
            onSuccess={handleSuccess}
            onError={() => console.log('Erreur')}
            locale={langue}
            theme={isDark ? 'filled_black' : 'outline'}
        />
    );
}

export default LoginGoogle;
