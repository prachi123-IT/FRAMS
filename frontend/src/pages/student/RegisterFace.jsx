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
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-blue-600 to-emerald-500 px-4">

      <div className="w-full max-w-md bg-white 
                      rounded-2xl shadow-2xl 
                      p-6 sm:p-8 text-center">

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Face Registration
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Please align your face properly and blink once.
        </p>

        {!imagePreview ? (
          <>
            {/* Camera */}
            <div className="rounded-xl overflow-hidden mb-6 
                            border-4 border-blue-500">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            </div>

            <button
              onClick={captureImage}
              className="w-full bg-blue-600 hover:bg-blue-700 
                         text-white py-3 rounded-lg 
                         font-semibold transition duration-300"
            >
              📸 Capture Photo
            </button>
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="mb-6">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full rounded-xl 
                           border-4 border-emerald-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={registerFace}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 
                           text-white py-2 rounded-lg 
                           font-semibold transition duration-300"
              >
                {loading ? "Registering..." : "✅ Confirm"}
              </button>

              <button
                onClick={() => setImagePreview(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 
                           text-white py-2 rounded-lg 
                           font-semibold transition duration-300"
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

export default RegisterFace;