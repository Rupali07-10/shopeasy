import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    register(email, password);
    toast.success("Account created 🎉");
    navigate("/");
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">

      <form className="bg-[#171717] p-8 rounded-2xl border border-white/10 w-[350px]">

        <h2 className="text-white text-xl mb-6 text-center">Register</h2>

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

        <button
          onClick={handleRegister}
          className="w-full bg-[#d4b06a] py-3 rounded-xl text-black"
        >
          Register
        </button>
      </form>
    </div>
  );
}