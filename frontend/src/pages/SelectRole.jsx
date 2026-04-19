import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

function SelectRole() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center 
                 flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/f2.webp')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-xl animate-fadeIn">
        <div
          className="bg-gradient-to-br from-white/20 to-white/5 
                     backdrop-blur-2xl 
                     p-6 sm:p-8 md:p-10 
                     rounded-2xl sm:rounded-3xl 
                     shadow-[0_0_40px_rgba(0,0,0,0.5)] 
                     border border-white/20 text-center"
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl 
                       font-bold text-white mb-8 sm:mb-10 tracking-wide"
          >
            Select Your Role
          </h1>

          {/* Cards Container */}
          <div
            className="flex flex-col sm:flex-row 
                       justify-center items-center 
                       gap-6 sm:gap-8"
          >
            {/* Student Card */}
            <div
              onClick={() => navigate("/login/student")}
              className="group w-full sm:w-44 cursor-pointer 
                         bg-white/10 hover:bg-white/20 
                         p-6 sm:p-8 rounded-2xl 
                         border border-white/10 
                         hover:border-blue-400 
                         transition-all duration-300 
                         transform hover:scale-105 hover:-translate-y-2 
                         hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]"
            >
              <FaUserGraduate className="text-4xl sm:text-5xl text-blue-400 mb-4 mx-auto group-hover:animate-bounce" />
              <p className="text-lg sm:text-xl text-white font-semibold">
                Student
              </p>
            </div>

            {/* Faculty Card */}
            <div
              onClick={() => navigate("/login/faculty")}
              className="group w-full sm:w-44 cursor-pointer 
                         bg-white/10 hover:bg-white/20 
                         p-6 sm:p-8 rounded-2xl 
                         border border-white/10 
                         hover:border-purple-400 
                         transition-all duration-300 
                         transform hover:scale-105 hover:-translate-y-2 
                         hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
            >
              <FaChalkboardTeacher className="text-4xl sm:text-5xl text-purple-400 mb-4 mx-auto group-hover:animate-bounce" />
              <p className="text-lg sm:text-xl text-white font-semibold">
                Faculty
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectRole;