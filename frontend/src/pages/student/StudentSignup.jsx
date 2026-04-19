import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function StudentSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post("/accounts/register/student/", form);
      alert("Account created successfully ✅");
      navigate("/login/student");
    } catch (err) {
      console.error(err);
      alert("Signup failed ❌");
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black px-4">

    <div className="bg-white/10 backdrop-blur-md w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl text-white">

      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
        Student Sign Up
      </h2>

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="w-full p-3 mb-4 rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-3 mb-6 rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/70"
      />

      <button
        onClick={handleSignup}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:scale-[1.02] transition duration-300"
      >
        Create Account
      </button>

      <p
        className="text-center mt-4 text-sm sm:text-base cursor-pointer text-blue-300 hover:underline"
        onClick={() => navigate("/login/student")}
      >
        Already have an account? Login
      </p>

    </div>
  </div>
);
}

export default StudentSignup;