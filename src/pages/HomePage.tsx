import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-4">Benvenuto nella Home</h1>
            <p className="text-gray-600 mb-6">Questa è la tua home page React + Redux + TS.</p>

            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Vai al Login
                </Link>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Azione Demo
                </button>
            </div>
        </div>
    );
}
