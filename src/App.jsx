import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import Historique from "./pages/Historique";
import ChatLingua from "./pages/ChatLingua";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/urgence" element={<ChatLingua />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/historique" element={<Historique />} />
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
  );
}