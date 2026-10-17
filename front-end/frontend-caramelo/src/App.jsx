import { BrowserRouter, Routes, Route } from 'react-router';
import Home from "./Home";
import Welcome from "./Welcome";
import About from './About';
import EnConstruction from './EnConstruction';
import Register from './RegisterConnexion/Register';
import Login from './RegisterConnexion/Login';
import Guest from './RegisterConnexion/Guest';
import Admin from './RegisterConnexion/Admin';
import Account from './Account';
import ForgotPassword from './RegisterConnexion/ForgotPassword';
import ResetPassword from './RegisterConnexion/ResetPassword';
import GuestLogin from './RegisterConnexion/GuestLogin';
import FormPerdu from './Formulaires/FormPerdu';
import FormTrouve from './Formulaires/FormTrouve';
import { ReglagesFlottants } from './Reglages';

function App() {

  return (
    <BrowserRouter>
      {/* langue + mode sombre en haut à droite sur les pages sans header */}
      <ReglagesFlottants />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<EnConstruction cleTitre="header.services" />} />
        <Route path="/contact" element={<EnConstruction cleTitre="header.contact" />} />
        <Route path="/account" element={<Account />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/guest-login" element={<GuestLogin />} />
        <Route path="/formperdu" element={<FormPerdu />} />
        <Route path="/formperdu/:id" element={<FormPerdu />} />
        <Route path="/formtrouve" element={<FormTrouve />} />
        <Route path="/formtrouve/:id" element={<FormTrouve />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
