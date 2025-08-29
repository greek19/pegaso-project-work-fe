import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import {loginSuccess} from "../features/auth/authSlice.ts";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            dispatch(loginSuccess({ token: data.token, username }));
            navigate("/");
        } catch (error) {
            alert("Credenziali non valide");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
