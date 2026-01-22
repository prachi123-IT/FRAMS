import cv2
import face_recognition
import numpy as np

def detect_blink(image):
    landmarks = face_recognition.face_landmarks(image)
    if not landmarks:
        return False

    landmarks = landmarks[0]

    if 'left_eye' not in landmarks or 'right_eye' not in landmarks:
        return False

    left_eye = landmarks['left_eye']
    right_eye = landmarks['right_eye']

    def eye_aspect_ratio(eye):
        A = np.linalg.norm(np.array(eye[1]) - np.array(eye[5]))
        B = np.linalg.norm(np.array(eye[2]) - np.array(eye[4]))
        C = np.linalg.norm(np.array(eye[0]) - np.array(eye[3]))
        return (A + B) / (2.0 * C)

    left_ear = eye_aspect_ratio(left_eye)
    right_ear = eye_aspect_ratio(right_eye)

    EAR_THRESHOLD = 0.21  

    return (left_ear + right_ear) / 2 < EAR_THRESHOLD