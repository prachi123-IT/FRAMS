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

      if (leftEye[1].y - leftEye[5].y < 2) {
        setBlinked(true);
      }

      if (nose[0].x - nose[3].x > 5 || nose[3].x - nose[0].x > 5) {
        setTurned(true);
      }

    }, 700);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  useEffect(() => {
    if (blinked && turned) {
      captureAndSend();
    }
  }, [blinked, turned]);

  const captureAndSend = async () => {
    if (processing) return;

    try {
      setProcessing(true);

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setProcessing(false);
        return;
      }

      const base64 = imageSrc.split(",")[1];

      await api.post(`attendance/mark-face/${sessionId}/`, {
        image: base64,
      });

      alert("Attendance Marked Successfully ✅");
      navigate("/student/success");

    } catch (err) {
      alert(JSON.stringify(err.response?.data));
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 px-4">
      
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl 
                      rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">

        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">
          AI Face Liveness Verification
        </h2>

        {!modelsLoaded && (
          <p className="text-center text-gray-200 mb-4">
            Loading AI Models...
          </p>
        )}

        {/* Webcam Container */}
        <div className="flex justify-center mb-6">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full max-w-sm rounded-xl border-4 border-white/20"
          />
        </div>

        {/* Status Indicators */}
        <div className="space-y-2 text-center">
          <p className="text-white">
            Blink: {blinked ? "✅" : "❌"}
          </p>
          <p className="text-white">
            Head Turn: {turned ? "✅" : "❌"}
          </p>
        </div>

        {processing && (
          <p className="text-center text-yellow-300 mt-4 animate-pulse">
            Verifying Face...
          </p>
        )}

      </div>
    </div>
  );
}

export default FaceLiveness;

