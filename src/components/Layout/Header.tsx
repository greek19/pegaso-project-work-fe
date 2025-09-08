import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useLogoutMutation} from "../../services/authApi.ts";
import { logout as logoutAction } from "../../features/auth/authSlice";

export default function Header() {
    const [logoutApi] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (err) {
            console.error("Errore durante il logout", err);
        } finally {
            dispatch(logoutAction());
            navigate("/login");
        }
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        Pegaso Bank
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/movimenti">
                                    Movimenti
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/operazioni">
                                    Operazioni
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
