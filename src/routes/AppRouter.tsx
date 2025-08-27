import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import type {RootState} from "../store/store";

export default function AppRouter() {
    const token = useSelector((state: RootState) => state.auth.token);

    return (
        <BrowserRouter>
            <Routes>
                {/* Login */}
                <Route
                    path="/login"
                    element={token ? <Navigate to="/" replace /> : <LoginPage />}
                />

                {/* Rotta protetta */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                {/* Rotta di fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
