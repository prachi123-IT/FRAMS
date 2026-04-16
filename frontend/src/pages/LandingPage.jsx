import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/select-role")}
      className="h-screen w-full bg-cover bg-center cursor-pointer"
      style={{ backgroundImage: "url('/FRAMS.png')" }}
    >
    </div>
  );
}

export default LandingPage;