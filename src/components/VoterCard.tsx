
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export interface Voter {
  id: string;
  name: string;
  registrationDate: string;
  status: "pending" | "approved" | "rejected";
  faceImage: string;
  hasVoted: boolean;
}

interface VoterCardProps {
  voter: Voter;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const VoterCard: React.FC<VoterCardProps> = ({ 
  voter,
  onApprove,
  onReject
}) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={voter.faceImage || "/placeholder.svg"} 
          alt={`${voter.name}'s face`}
          className="w-full h-full object-cover"
        />
        
        {voter.hasVoted && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Voted
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{voter.name}</CardTitle>
          <Badge className={statusColors[voter.status]}>
            {voter.status.charAt(0).toUpperCase() + voter.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="text-sm text-muted-foreground pb-2">
        <p>Registered: {new Date(voter.registrationDate).toLocaleDateString()}</p>
      </CardContent>
      
      {voter.status === "pending" && onApprove && onReject && (
        <CardFooter className="flex gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onReject(voter.id)}
          >
            <X className="mr-1 h-4 w-4" />
            Reject
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onApprove(voter.id)}
          >
            <Check className="mr-1 h-4 w-4" />
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VoterCard;
