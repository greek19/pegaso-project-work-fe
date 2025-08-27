import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type {RootState} from "../store/store";
import type {JSX} from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = useSelector((state: RootState) => state.auth.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
