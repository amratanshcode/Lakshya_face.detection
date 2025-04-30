
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface FaceVerificationProps {
  onVerificationComplete: (success: boolean) => void;
  userId?: string;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ 
  onVerificationComplete,
  userId 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
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
  
  const verifyFace = () => {
    setVerifying(true);
    setProgress(0);
    
    // Simulate the verification process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeVerification();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const completeVerification = () => {
    // For demo purposes, we'll randomly verify or fail with an 80% success rate
    // In a real app, you'd use your face_recognition API here
    const success = Math.random() > 0.2;
    
    setTimeout(() => {
      setVerifying(false);
      
      if (success) {
        toast({
          title: "Identity Verified",
          description: "Your face has been verified successfully.",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "We couldn't verify your identity. Please try again.",
          variant: "destructive",
        });
      }
      
      onVerificationComplete(success);
    }, 500);
  };

  return (
    <div className="face-capture-container">
      <div className="webcam-container">
        <video 
          ref={videoRef} 
          className={`w-full rounded-lg border shadow-sm ${verifying ? 'pulse-animation' : ''}`}
          autoPlay 
          playsInline
        />
        <div className="face-outline"></div>
        
        {verifying && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <p className="text-sm font-medium mb-2">Verifying your identity...</p>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={verifyFace} 
        className="mt-4 w-full"
        disabled={!streaming || verifying}
      >
        {verifying ? "Verifying..." : "Verify Identity"}
      </Button>
    </div>
  );
};

export default FaceVerification;
