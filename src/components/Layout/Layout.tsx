import { Outlet } from "react-router-dom";
import Header from "./Header.tsx";

export default function Layout() {
    return (
        <div className="app-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />

            <main style={{ flex: 1, padding: "1rem" }}>
                <Outlet />
            </main>

            <footer style={{ background: "#f1f1f1", padding: "1rem", textAlign: "center" }}>
                <p>© {new Date().getFullYear()} {import.meta.env.VITE_TITLE}</p>
            </footer>
        </div>
    );
}
