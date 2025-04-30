
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FaceCaptureProps {
  onCapture: (imageData: string) => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: "user"
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };
    
    startCamera();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);
  
  const captureImage = () => {
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(countdownInterval);
          takePicture();
          return null;
        }
      });
    }, 1000);
  };
  
  const takePicture = () => {
    if (canvasRef.current && videoRef.current && streaming) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/png');
        onCapture(imageData);
        
        toast({
          title: "Success",
          description: "Face captured successfully!",
        });
      }
    }
  };

  return (
    <div className="face-capture-container">
      <div className="webcam-container">
        <video 
          ref={videoRef} 
          className="w-full rounded-lg border shadow-sm" 
          autoPlay 
          playsInline
        />
        <div className="face-outline"></div>
        
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <span className="text-6xl font-bold text-white">{countdown}</span>
          </div>
        )}
      </div>
      
      <Button 
        onClick={captureImage} 
        className="mt-4 w-full"
        disabled={!streaming || countdown !== null}
      >
        <Camera className="mr-2 h-4 w-4" />
        Capture Face
      </Button>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaceCapture;
