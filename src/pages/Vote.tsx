
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FaceVerification from "@/components/FaceVerification";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { candidates, castVote } from "@/utils/api";
import { Check } from "lucide-react";

enum VotingStep {
  FACE_VERIFICATION,
  SELECT_CANDIDATE,
  CONFIRMATION
}

const Vote = () => {
  const [step, setStep] = useState<VotingStep>(VotingStep.FACE_VERIFICATION);
  const [candidateId, setCandidateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      setStep(VotingStep.SELECT_CANDIDATE);
    } else {
      toast({
        title: "Verification Failed",
        description: "We couldn't verify your identity. Please try again or contact an administrator.",
        variant: "destructive",
      });
    }
  };
  
  const handleSelectCandidate = () => {
    if (!candidateId) {
      toast({
        title: "No Selection",
        description: "Please select a candidate to vote for.",
        variant: "destructive",
      });
      return;
    }
    
    setStep(VotingStep.CONFIRMATION);
  };
  
  const handleCastVote = async () => {
    if (!candidateId) {
      toast({
        title: "No Selection",
        description: "Please select a candidate to vote for.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would use the actual voter ID from the verification step
      const result = await castVote("3", candidateId);
      
      if (result) {
        setSuccess(true);
        toast({
          title: "Vote Cast Successfully",
          description: "Your vote has been recorded. Thank you for participating!",
        });
      } else {
        toast({
          title: "Voting Failed",
          description: "There was a problem casting your vote. You may have already voted or your registration is not approved.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Voting error:", error);
      toast({
        title: "Voting Failed",
        description: "There was a problem casting your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const selectedCandidate = candidates.find(c => c.id === candidateId);
  
  const renderStepContent = () => {
    switch (step) {
      case VotingStep.FACE_VERIFICATION:
        return (
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Before you can vote, we need to verify your identity using facial recognition.
            </p>
            <FaceVerification onVerificationComplete={handleVerificationComplete} />
          </CardContent>
        );
        
      case VotingStep.SELECT_CANDIDATE:
        return (
          <>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Select a Candidate</p>
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name} - {candidate.party}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {candidateId && (
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{selectedCandidate?.name}</CardTitle>
                    <CardDescription>{selectedCandidate?.party}</CardDescription>
                  </CardHeader>
                </Card>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Please review your selection carefully. You can only vote once, and your vote cannot be changed after submission.
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button onClick={handleSelectCandidate} disabled={!candidateId} className="w-full">
                Continue
              </Button>
            </CardFooter>
          </>
        );
        
      case VotingStep.CONFIRMATION:
        if (success) {
          return (
            <CardContent className="space-y-6 text-center">
              <div className="bg-green-100 text-green-800 rounded-full h-20 w-20 flex items-center justify-center mx-auto">
                <Check className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Vote Cast Successfully!</h3>
                <p className="text-muted-foreground mt-2">
                  Your vote has been securely recorded. Thank you for participating in the election.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCandidateId("");
                  setSuccess(false);
                  setStep(VotingStep.FACE_VERIFICATION);
                }}
              >
                Return to Start
              </Button>
            </CardContent>
          );
        }
        
        return (
          <>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Confirm Your Vote</p>
                
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{selectedCandidate?.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedCandidate?.party}</p>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Selected
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 font-medium">
                  Important: This action cannot be undone
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  By clicking "Cast Vote" below, you confirm that this is your final selection. 
                  You can only vote once in this election.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(VotingStep.SELECT_CANDIDATE)}
                className="flex-1"
                disabled={loading}
              >
                Change Selection
              </Button>
              <Button 
                onClick={handleCastVote} 
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Processing..." : "Cast Vote"}
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
            <h1 className="text-3xl font-bold">Cast Your Vote</h1>
            <p className="text-muted-foreground mt-2">
              Securely vote in the current election
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {step === VotingStep.FACE_VERIFICATION && "Identity Verification"}
                {step === VotingStep.SELECT_CANDIDATE && "Select Your Candidate"}
                {step === VotingStep.CONFIRMATION && (success ? "Vote Confirmed" : "Confirm Your Vote")}
              </CardTitle>
              <CardDescription>
                {step === VotingStep.FACE_VERIFICATION && "Verify your identity with facial recognition"}
                {step === VotingStep.SELECT_CANDIDATE && "Choose the candidate you want to vote for"}
                {step === VotingStep.CONFIRMATION && (success ? "Your vote has been recorded" : "Review and confirm your selection")}
              </CardDescription>
            </CardHeader>
            
            {renderStepContent()}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Vote;
