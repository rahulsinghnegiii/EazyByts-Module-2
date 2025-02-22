import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";
      const userData = isLogin ? { email, password } : { name, email, password };

      const { data } = await axios.post(
        `http://localhost:5000/api/auth/${endpoint}`,
        userData
      );

      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Redirect after login/signup
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-sm text-gray-500 mt-2 cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
