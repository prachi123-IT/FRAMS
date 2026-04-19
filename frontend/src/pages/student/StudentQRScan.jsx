import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function StudentQRScan() {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        let token = decodedText.includes("/")
          ? decodedText.split("/").pop()
          : decodedText;

        try {
          const response = await api.get(
            `attendance/verify-qr/${token}/`
          );

          const sessionId = response.data.session_id;

          await scanner.clear();
          navigate(`/student/face-scan/${sessionId}`);

        } catch (err) {
          alert("QR Session Expired or Invalid ❌");
        }
      },
      (error) => {
        console.log("QR Scan Error:", error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-indigo-500 to-purple-600 px-4">

      <div className="w-full max-w-md bg-white 
                      rounded-2xl shadow-2xl 
                      p-6 sm:p-8 text-center">

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Scan Attendance QR
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Align the QR code inside the frame
        </p>

        <div className="rounded-xl overflow-hidden 
                        border-4 border-indigo-500 
                        p-3">
          <div id="qr-reader" className="w-full" />
        </div>

      </div>
    </div>
  );
}

export default StudentQRScan;



