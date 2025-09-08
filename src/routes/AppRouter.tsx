import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Layout from "../components/Layout/Layout";
import HomePage from "../pages/HomePage";
import Operazioni from "../pages/Operazioni.tsx";
import FondiPage from "../pages/FondiPage.tsx";
import PrestitiPage from "../pages/PrestitiPage.tsx";
import PolizzePage from "../pages/PolizzePage.tsx";
import MovimentiPage from "../pages/MovimentiPage.tsx";

export default function AppRouter() {
    const token = useSelector((state: RootState) => state.auth.token);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={token ? <Navigate to="/" replace /> : <LoginPage />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="movimenti" element={<MovimentiPage />} />
                    <Route path="operazioni" element={<Operazioni />} />
                    <Route path="fondi" element={<FondiPage />} />
                    <Route path="prestiti" element={<PrestitiPage />} />
                    <Route path="polizze" element={<PolizzePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
