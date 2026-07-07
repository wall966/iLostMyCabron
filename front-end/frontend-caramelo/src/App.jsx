import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css'
import Home from "./home";
import Welcome from "./welcome";
import About from './About';
import Contact from './Contact';
import Services from './Services';
import Register from './RegisterConnexion/Register';
import Login from './RegisterConnexion/Login';
import Guest from './RegisterConnexion/Guest';
import Admin from './RegisterConnexion/Admin';
import Account from './Account';
import ForgotPassword from './RegisterConnexion/ForgotPassword';
import ResetPassword from './RegisterConnexion/ResetPassword';
import GuestLogin from './RegisterConnexion/GuestLogin';
import LoginGoogle from './RegisterConnexion/LoginGoogle';
import FormPerdu from './Formulaires/FormPerdu';
import FormTrouve from './Formulaires/FormTrouve';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path ="/services" element={<Services />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/account" element={<Account />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/guest-login" element={<GuestLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/formperdu" element={<FormPerdu />} />
        <Route path="/formperdu/:id" element={<FormPerdu />} />
        <Route path="/formtrouve" element={<FormTrouve />} />
        <Route path="/formtrouve/:id" element={<FormTrouve />} />
        <Route path="/LoginGoogle" element={<LoginGoogle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
