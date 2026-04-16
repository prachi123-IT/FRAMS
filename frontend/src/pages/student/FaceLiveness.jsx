import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

function FaceLiveness() {
  const webcamRef = useRef(null);
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [blinked, setBlinked] = useState(false);
  const [turned, setTurned] = useState(false);
  const [processing, setProcessing] = useState(false);

  
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // Auto Detection Loop
  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      if (!webcamRef.current) return;

      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) return;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (!detection) return;

      const landmarks = detection.landmarks;
      const leftEye = landmarks.getLeftEye();
      const nose = landmarks.getNose();

      // Blink detection
      if (leftEye[1].y - leftEye[5].y < 2) {
        setBlinked(true);
      }

      // Head turn detection
      if (nose[0].x - nose[3].x > 5 || nose[3].x - nose[0].x > 5) {
        setTurned(true);
      }

    }, 700);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  // Auto capture when both done
  useEffect(() => {
    if (blinked && turned) {
      captureAndSend();
    }
  }, [blinked, turned]);


  const captureAndSend = async () => {
    if (processing) return;   

    try {
      setProcessing(true);

      console.log("📸 Capturing image...");

      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        console.log("❌ Screenshot failed");
        setProcessing(false);
        return;
      }

      const base64 = imageSrc.split(",")[1];

      console.log("🚀 Sending to backend...");

      const response = await api.post(
        `attendance/mark-face/${sessionId}/`,
        { image: base64 }
      );

      console.log("✅ Backend Response:", response.data);

      alert("Attendance Marked Successfully ✅");
      navigate("/student/success");

    } catch (err) {
      console.log("❌ FULL ERROR:", err.response);
      console.log("❌ ERROR DATA:", err.response?.data);

      alert(JSON.stringify(err.response?.data));

      setProcessing(false);
    }
  };


  return (
    <div style={{ textAlign: "center" }}>
      <h2>AI Face Liveness Verification</h2>

      {!modelsLoaded && <p>Loading AI Models...</p>}

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
      />

      <div>
        <p>Blink: {blinked ? "✅" : "❌"}</p>
        <p>Head Turn: {turned ? "✅" : "❌"}</p>
      </div>

      {processing && <p>Verifying Face...</p>}
    </div>
  );
}

export default FaceLiveness;

