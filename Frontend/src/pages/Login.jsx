import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const success = login(email, password);

    if (success) {
      toast.success("Login successful ✅");
      navigate("/");
    } else {
      toast.error("Invalid credentials ❌");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="bg-[#171717] p-8 rounded-2xl border border-white/10 w-[350px]"
      >
        <h2 className="text-white text-xl mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 bg-[#1a1a1a] text-white rounded-xl"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 bg-[#1a1a1a] text-white rounded-xl"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-[#d4b06a] py-3 rounded-xl text-black">
          Login
        </button>
      </form>
    </div>
  );
}