import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

function SelectRole() {
    const navigate = useNavigate();

    return (
        <div
            className="relative h-screen w-full bg-cover bg-center flex items-center justify-center overflow-hidden"
            style={{ backgroundImage: "url('/f2.webp')" }}
        >
            <div className="absolute inset-0 bg-black/40"></div>
            
            <div className="relative z-10  animate-fadeIn">

                <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl p-12 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/20 text-center w-[500px]">

                    <h1 className="text-4xl font-bold text-white mb-12 tracking-wide">
                        Select Your Role
                    </h1>

                    <div className="flex justify-center gap-10">

                        {/* Student Card */}
                        <div
                            onClick={() => navigate("/login/student")}
                            className="group cursor-pointer bg-white/10 hover:bg-white/20 p-8 rounded-2xl border border-white/10 hover:border-blue-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]"
                        >
                            <FaUserGraduate className="text-5xl text-blue-400 mb-4 mx-auto group-hover:animate-bounce" />
                            <p className="text-xl text-white font-semibold">
                                Student
                            </p>
                        </div>

                        {/* Faculty Card */}
                        <div
                            onClick={() => navigate("/login/faculty")}
                            className="group cursor-pointer bg-white/10 hover:bg-white/20 p-8 rounded-2xl border border-white/10 hover:border-blue-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]"
                        >
                            <FaChalkboardTeacher className="text-5xl text-purple-400 mb-4 mx-auto group-hover:animate-bounce" />
                            <p className="text-xl text-white font-semibold">
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