import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

interface LoginFormInputs {
    username: string;
    password: string;
}

const schema = yup.object().shape({
    username: yup.string().required("Username obbligatorio"),
    password: yup.string().required("Password obbligatoria"),
});

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: LoginFormInputs) => {
        // Qui simuliamo il login: in futuro chiamerai l'API
        dispatch(login({ token: "fakeToken123", user: data.username }));
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Username</label>
                    <input
                        type="text"
                        {...register("username")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Accedi
                </button>
            </form>
        </div>
    );
}
