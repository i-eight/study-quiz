'use client';

import { useRef, useState, useEffect } from 'react';

interface CameraComponentProps {
  onCapture: (imageData: string) => void;
}

export default function CameraComponent({ onCapture }: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const stream = videoRef.current?.srcObject as MediaStream;
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        'カメラへのアクセスができませんでした。カメラの許可を確認してください。',
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture(imageData);

        // Stop the camera
        stopCamera();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0]!;
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          onCapture(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">教科書の写真を撮影または選択</h2>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        {isCameraActive ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border border-gray-300"
            />
            <button
              onClick={captureImage}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white p-3 shadow-lg"
              aria-label="撮影"
            >
              <div className="size-12 rounded-full border-4 border-blue-500"></div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
            <p className="mb-4 text-gray-500">
              カメラで撮影するか、画像ファイルを選択してください
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={startCamera}
                className="btn btn-primary flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                カメラを起動
              </button>
              <label className="btn btn-secondary flex cursor-pointer items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3zm5 3a5 5 0 00-10 0v4a5 5 0 0010 0V7z"
                    clipRule="evenodd"
                  />
                  <path d="M14 7a6 6 0 00-12 0v4a6 6 0 0012 0V7zm-1 4a5 5 0 01-10 0V7a5 5 0 0110 0v4z" />
                </svg>
                画像を選択
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
