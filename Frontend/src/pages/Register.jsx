import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password);
      toast.success("Signup successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-20 transition-colors">
      <Navbar setSearch={() => {}} />

      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSignup}
          className="bg-white dark:bg-[#171717] p-8 rounded-xl shadow-sm w-full max-w-[380px] border border-gray-100 dark:border-white/10"
        >
          <h1 className="text-2xl font-semibold mb-2 text-center text-gray-900 dark:text-white">
            Register
          </h1>
          <div className="w-16 h-1 bg-[#d4b06a] mx-auto mb-6 rounded"></div>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-gray-300 dark:border-white/20 rounded outline-none bg-white dark:bg-black/20 text-gray-900 dark:text-white placeholder:text-gray-400"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-11 border border-gray-300 dark:border-white/20 rounded outline-none bg-white dark:bg-black/20 text-gray-900 dark:text-white placeholder:text-gray-400"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-stone-400 hover:text-gray-900 dark:hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="w-full bg-black dark:bg-[#d4b06a] text-white dark:text-black p-3 rounded hover:bg-gray-800 dark:hover:bg-[#e3bf77] transition">
            Sign Up
          </button>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-stone-400">
            Already a user?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 dark:text-[#d4b06a] hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
