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

  const handleSignup = async () => {
    try {
      await api.post("accounts/register/student/", form);
      alert("Account created successfully ✅");
      navigate("/login/student");
    } catch (err) {
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          Student Sign Up
        </h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 focus:outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-white/20 focus:outline-none"
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:scale-105 transition"
        >
          Create Account
        </button>

        <p
          className="text-center mt-4 cursor-pointer text-blue-300"
          onClick={() => navigate("/login/student")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default StudentSignup;