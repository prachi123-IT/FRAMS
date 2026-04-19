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
      } else {
        navigate("/faculty");
      }
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center 
                 flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/f2.webp')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md 
                   bg-gradient-to-br from-white/20 to-white/5 
                   backdrop-blur-2xl 
                   p-6 sm:p-8 md:p-10 
                   rounded-2xl sm:rounded-3xl
                   shadow-[0_0_40px_rgba(0,0,0,0.6)] 
                   border border-white/20"
      >
        <h2 className="text-2xl sm:text-3xl font-bold 
                       text-white text-center mb-6 sm:mb-8">
          {role === "student" ? "Student Login" : "Faculty Login"}
        </h2>

        {/* Username */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded-xl 
                       bg-white/10 border border-white/20 
                       text-white placeholder-gray-300 
                       focus:outline-none 
                       focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 pr-10 rounded-xl 
                       bg-white/10 border border-white/20 
                       text-white placeholder-gray-300 
                       focus:outline-none 
                       focus:ring-2 focus:ring-purple-400"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 
                       -translate-y-1/2 
                       text-gray-300 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Button */}
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

        {/* Signup link */}
        {role === "student" && (
          <p
            className="text-center mt-4 text-sm sm:text-base 
                       cursor-pointer text-blue-300 
                       hover:text-blue-400 transition"
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
