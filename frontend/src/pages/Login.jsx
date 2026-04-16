import axios from 'axios'
import { useState } from 'react'
import api from "../api/axios";
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { role } = useParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("accounts/login/", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      alert('Login Successful');
      if (res.data.role === 'STUDENT') {
        navigate("/student");
      }
      else {
        navigate("/faculty");
      }
    }
    catch (err) {
      alert("Invalid Credentials");
    }

  };

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/f2.webp')" }}
    >
      
      <div className="absolute inset-0 bg-black/40"></div>
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-gradient-to-br from-white/20 to-white/5 
                   backdrop-blur-2xl p-10 rounded-3xl 
                   shadow-[0_0_60px_rgba(0,0,0,0.6)] 
                   border border-white/20 w-[400px] 
                   "
      >


        <h2 className="text-3xl font-bold text-white text-center mb-8">
          {role === "student" ? "Student Login" : "Faculty Login"}
        </h2>

        {/* Username Field */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white/10 
               border border-white/20 text-white 
               placeholder-gray-300 
               focus:outline-none 
               focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Field */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className=" w-full p-3 rounded-xl bg-white/10 
                       border border-white/20 text-white 
                       placeholder-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-purple-400"

          />

        
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-300 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        
        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-semibold 
                     bg-gradient-to-r from-blue-500 to-purple-500 
                     hover:from-blue-600 hover:to-purple-600 
                     transition-all duration-300 
                     hover:scale-105 shadow-lg"
        >
          Login
        </button>
        {role === "student" && (
          <p
            className="text-center mt-4 cursor-pointer text-blue-300"
            onClick={() => navigate("/signup/student")}
          >
            New here? Create Account
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
