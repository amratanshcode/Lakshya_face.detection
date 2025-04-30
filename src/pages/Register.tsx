
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FaceCapture from "@/components/FaceCapture";
import { useToast } from "@/components/ui/use-toast";
import { registerVoter } from "@/utils/api";
import { Separator } from "@/components/ui/separator";

enum RegistrationStep {
  PERSONAL_INFO,
  FACE_CAPTURE,
  CONFIRMATION
}

const Register = () => {
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.PERSONAL_INFO);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [faceImage, setFaceImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleNextStep = () => {
    if (step === RegistrationStep.PERSONAL_INFO) {
      if (!name || !email) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      setStep(RegistrationStep.FACE_CAPTURE);
    }
  };
  
  const handleFaceCapture = (imageData: string) => {
    setFaceImage(imageData);
    setStep(RegistrationStep.CONFIRMATION);
  };
  
  const handleSubmitRegistration = async () => {
    if (!name || !faceImage) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps of registration.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await registerVoter(name, faceImage);
      toast({
        title: "Registration Successful",
        description: "Your registration is pending approval by an administrator.",
      });
      
      // Clear form and go back to first step
      setName("");
      setEmail("");
      setFaceImage("");
      setStep(RegistrationStep.PERSONAL_INFO);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case RegistrationStep.PERSONAL_INFO:
        return (
          <>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button onClick={handleNextStep} className="w-full">
                Next: Capture Face
              </Button>
            </CardFooter>
          </>
        );
        
      case RegistrationStep.FACE_CAPTURE:
        return (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Please position your face within the outline and ensure good lighting conditions.
            </p>
            <FaceCapture onCapture={handleFaceCapture} />
            <Button 
              variant="outline" 
              onClick={() => setStep(RegistrationStep.PERSONAL_INFO)}
              className="w-full mt-2"
            >
              Back to Personal Info
            </Button>
          </CardContent>
        );
        
      case RegistrationStep.CONFIRMATION:
        return (
          <>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Registration Preview</Label>
                <div className="rounded-lg border overflow-hidden p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/2">
                      <div className="w-full max-w-[200px] mx-auto">
                        <img 
                          src={faceImage} 
                          alt="Your face" 
                          className="rounded-lg border w-full"
                        />
                      </div>
                    </div>
                    <div className="sm:w-1/2">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <p className="font-medium">{name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <p className="font-medium">{email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your registration will be reviewed by an administrator before you can vote.
                    You will be notified when your registration is approved.
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(RegistrationStep.FACE_CAPTURE)}
                className="w-full sm:w-1/2"
              >
                Retake Face Photo
              </Button>
              <Button 
                onClick={handleSubmitRegistration} 
                disabled={loading}
                className="w-full sm:w-1/2"
              >
                {loading ? "Submitting..." : "Complete Registration"}
              </Button>
            </CardFooter>
          </>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-lg mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Voter Registration</h1>
            <p className="text-muted-foreground mt-2">
              Register to participate in the upcoming election
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${step >= RegistrationStep.PERSONAL_INFO ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= RegistrationStep.PERSONAL_INFO ? 'bg-primary' : 'bg-muted'} text-white text-sm`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Personal Info</span>
              </div>
              
              <Separator className="w-12" />
              
              <div className={`flex items-center ${step >= RegistrationStep.FACE_CAPTURE ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= RegistrationStep.FACE_CAPTURE ? 'bg-primary' : 'bg-muted'} text-white text-sm`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Face Capture</span>
              </div>
              
              <Separator className="w-12" />
              
              <div className={`flex items-center ${step >= RegistrationStep.CONFIRMATION ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= RegistrationStep.CONFIRMATION ? 'bg-primary' : 'bg-muted'} text-white text-sm`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Confirmation</span>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {step === RegistrationStep.PERSONAL_INFO && "Personal Information"}
                {step === RegistrationStep.FACE_CAPTURE && "Face Capture"}
                {step === RegistrationStep.CONFIRMATION && "Confirm Registration"}
              </CardTitle>
              <CardDescription>
                {step === RegistrationStep.PERSONAL_INFO && "Enter your personal details"}
                {step === RegistrationStep.FACE_CAPTURE && "Capture your face for verification"}
                {step === RegistrationStep.CONFIRMATION && "Review your information and submit"}
              </CardDescription>
            </CardHeader>
            
            {renderStepContent()}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Register;
