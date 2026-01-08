import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Collections from "../pages/Collections/Collections";
import Artists from "../pages/Artists/Artists";
import AuthCallback from "../pages/Auth/AuthCallback";
import Header from "../components/layout/Header/Header";

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/artists" element={<Artists />} />
        {/* fallback route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
