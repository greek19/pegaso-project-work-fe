import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../services/authApi";
import { Spinner, Form, Button, Card, Nav } from "react-bootstrap";

export default function LoginPage() {
    const [mode, setMode] = useState<"login" | "register">("login");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [register, { isLoading: registerLoading }] = useRegisterMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login({ username, password }).unwrap();
            dispatch(loginSuccess({ token: data.token, username }));
            navigate("/");
        } catch {
            alert("Credenziali non valide");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Le password non coincidono");
            return;
        }
        try {
            await register({ username, password }).unwrap();
            alert("Registrazione avvenuta con successo, effettua il login!");
            setMode("login");
        } catch {
            alert("Errore durante la registrazione");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card className="shadow-lg" style={{ width: "28rem" }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Benvenuto in MyBank</h3>

                    <Nav fill variant="tabs" activeKey={mode} className="mb-4">
                        <Nav.Item>
                            <Nav.Link eventKey="login" onClick={() => setMode("login")}>
                                Login
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="register" onClick={() => setMode("register")}>
                                Registrati
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {mode === "login" ? (
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Inserisci il tuo username"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Inserisci la tua password"
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button type="submit" variant="primary" disabled={loginLoading}>
                                    {loginLoading ? <Spinner size="sm" animation="border" /> : "Login"}
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Scegli un username"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Scegli una password"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Conferma Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ripeti la password"
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button type="submit" variant="success" disabled={registerLoading}>
                                    {registerLoading ? <Spinner size="sm" animation="border" /> : "Registrati"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}
