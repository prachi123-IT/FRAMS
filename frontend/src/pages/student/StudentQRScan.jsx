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

          scanner.clear(); // stop camera
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
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Scan Attendance QR</h2>
        <p style={styles.subtitle}>
          Align the QR code inside the frame
        </p>

        <div style={styles.scannerBox}>
          <div id="qr-reader" />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  scannerBox: {
    borderRadius: "15px",
    overflow: "hidden",
    border: "3px solid #667eea",
    padding: "10px",
  },
};

export default StudentQRScan;



