import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const { signup, login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  // ✅ ALWAYS before any return
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Login successful");
      } else {
        await signup(email, password, name);
        toast.success("Verification email sent 📩"); // better UX
      }

      resetForm(); // 🔥 clear immediately
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ AFTER all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#171717] rounded-xl p-6 w-full max-w-[350px] relative border border-transparent dark:border-white/10">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-700 dark:text-white"
        >
          x
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {!isLogin && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 dark:border-white/20 p-2 rounded bg-white dark:bg-black/20 text-gray-900 dark:text-white"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 dark:border-white/20 p-2 rounded bg-white dark:bg-black/20 text-gray-900 dark:text-white"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-white/20 p-2 pr-10 rounded bg-white dark:bg-black/20 text-gray-900 dark:text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-stone-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="bg-black dark:bg-[#d4b06a] text-white dark:text-black py-2 rounded">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-3 text-gray-600 dark:text-stone-400">
          {isLogin ? "New user?" : "Already have an account?"}
          <span
            className="text-[#d4b06a] cursor-pointer ml-1"
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm(); // 🔥 also clear when switching
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}