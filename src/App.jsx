import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import MesCommandes from "./pages/MesCommandes";
import ChatLingua from "./pages/ChatLingua";
import UrgenceAuth from "./pages/UrgenceAuth";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/urgence" element={<UrgenceAuth />} />
        <Route path="/chat-lingua" element={<ChatLingua />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mes-commandes" element={<MesCommandes />} />
          <Route path="/cgv" element={<div className="p-8 text-center text-white">CGV — Bientôt disponible</div>} />
          <Route path="/mentions-legales" element={<div className="p-8 text-center text-white">Mentions légales — Bientôt disponible</div>} />
          <Route path="/confidentialite" element={<div className="p-8 text-center text-white">Confidentialité — Bientôt disponible</div>} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/partner" element={
            <ProtectedRoute allowedRoles={["partner","admin"]}>
              <PartnerDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}