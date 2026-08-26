import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import APropos from "./pages/APropos";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import MesCommandes from "./pages/MesCommandes";
import ChatLingua from "./pages/ChatLingua";
import Vendeur from "./pages/Vendeur";
import CGV from "./pages/CGV";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/urgence" element={<ChatLingua />} />
        <Route path="/chat-lingua" element={<Navigate to="/urgence" replace />} />
        <Route path="/urgence-auth" element={<Navigate to="/urgence" replace />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/mes-commandes" element={<MesCommandes />} />
          <Route path="/espace-vendeur" element={<Vendeur />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
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