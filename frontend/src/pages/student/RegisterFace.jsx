import { useRef, useState } from "react";
import Webcam from "react-webcam";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function RegisterFace() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImagePreview(imageSrc);
  };

  const registerFace = async () => {
    try {
      setLoading(true);

      const base64 = imagePreview.split(",")[1];

      await api.post("attendance/register-face/", {
        image: base64,
      });

      alert("Face Registered Successfully ✅");
      navigate("/student");

    } catch (err) {
      alert(err.response?.data?.error || "Registration failed ❌");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Face Registration</h2>
        <p style={styles.subtitle}>
          Please align your face properly and blink once.
        </p>

        {!imagePreview ? (
          <>
            <div style={styles.cameraWrapper}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={styles.webcam}
              />
            </div>

            <button style={styles.primaryBtn} onClick={captureImage}>
              📸 Capture Photo
            </button>
          </>
        ) : (
          <>
            <div style={styles.previewWrapper}>
              <img
                src={imagePreview}
                alt="Preview"
                style={styles.previewImage}
              />
            </div>

            <div style={styles.buttonRow}>
              <button
                style={styles.successBtn}
                onClick={registerFace}
                disabled={loading}
              >
                {loading ? "Registering..." : "✅ Confirm"}
              </button>

              <button
                style={styles.secondaryBtn}
                onClick={() => setImagePreview(null)}
              >
                🔄 Retake
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4e73df, #1cc88a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "5px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },
  cameraWrapper: {
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "20px",
    border: "3px solid #4e73df",
  },
  webcam: {
    width: "100%",
  },
  previewWrapper: {
    marginBottom: "20px",
  },
  previewImage: {
    width: "100%",
    borderRadius: "12px",
    border: "3px solid #1cc88a",
  },
  primaryBtn: {
    backgroundColor: "#4e73df",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
  },
  successBtn: {
    backgroundColor: "#1cc88a",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryBtn: {
    backgroundColor: "#858796",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
};

export default RegisterFace;