import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full mb-2 dark:bg-gray-700 dark:text-white" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full mb-2 dark:bg-gray-700 dark:text-white" />
                    <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
