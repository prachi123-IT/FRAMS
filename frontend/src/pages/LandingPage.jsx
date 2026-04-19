import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/select-role")}
      className="relative w-full h-screen 
                 bg-[url('/FRAMS.png')] 
                 bg-center 
                 bg-contain 
                 sm:bg-cover 
                 bg-no-repeat
                 flex items-center justify-center
                 cursor-pointer"
    >
     
    </div>
  );
}

export default LandingPage;