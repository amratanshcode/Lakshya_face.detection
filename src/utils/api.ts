
import { Voter } from "@/components/VoterCard";

// Mock candidates data
export const candidates = [
  { id: "1", name: "John Smith", party: "Democratic Party" },
  { id: "2", name: "Sarah Johnson", party: "Republican Party" },
  { id: "3", name: "Michael Williams", party: "Independent" },
  { id: "4", name: "Jessica Brown", party: "Green Party" },
];

// Mock voters data
let voters: Voter[] = [
  {
    id: "1",
    name: "Alex Morgan",
    registrationDate: "2023-11-15T10:30:00",
    status: "approved",
    faceImage: "/placeholder.svg",
    hasVoted: true,
  },
  {
    id: "2",
    name: "Jamie Lee",
    registrationDate: "2023-11-16T14:20:00",
    status: "pending",
    faceImage: "/placeholder.svg",
    hasVoted: false,
  },
  {
    id: "3",
    name: "Riley Johnson",
    registrationDate: "2023-11-17T09:45:00",
    status: "approved",
    faceImage: "/placeholder.svg",
    hasVoted: false,
  },
];

// Mock votes data
let votes: { voterId: string; candidateId: string; timestamp: string }[] = [
  {
    voterId: "1",
    candidateId: "2",
    timestamp: "2023-11-20T11:15:30",
  },
];

// Mock admin credentials
const adminCredentials = {
  username: "admin",
  password: "admin123",
};

// API functions
export const registerVoter = async (
  name: string,
  faceImage: string
): Promise<Voter> => {
  // In a real app, this would be a server call to store the face encoding
  return new Promise((resolve) => {
    setTimeout(() => {
      const newVoter: Voter = {
        id: (voters.length + 1).toString(),
        name,
        registrationDate: new Date().toISOString(),
        status: "pending",
        faceImage,
        hasVoted: false,
      };
      
      voters = [...voters, newVoter];
      resolve(newVoter);
    }, 1000);
  });
};

export const getVoters = async (): Promise<Voter[]> => {
  // In a real app, this would fetch from the database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(voters);
    }, 500);
  });
};

export const approveVoter = async (id: string): Promise<Voter[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      voters = voters.map(voter => 
        voter.id === id ? { ...voter, status: "approved" } : voter
      );
      resolve(voters);
    }, 500);
  });
};

export const rejectVoter = async (id: string): Promise<Voter[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      voters = voters.map(voter => 
        voter.id === id ? { ...voter, status: "rejected" } : voter
      );
      resolve(voters);
    }, 500);
  });
};

export const verifyVoter = async (voterId: string): Promise<boolean> => {
  // In a real app, this would use the face_recognition library to match
  return new Promise((resolve) => {
    setTimeout(() => {
      const voter = voters.find(v => v.id === voterId);
      resolve(!!voter && voter.status === "approved" && !voter.hasVoted);
    }, 1500);
  });
};

export const castVote = async (
  voterId: string,
  candidateId: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const voter = voters.find(v => v.id === voterId);
      
      if (voter && voter.status === "approved" && !voter.hasVoted) {
        votes.push({
          voterId,
          candidateId,
          timestamp: new Date().toISOString(),
        });
        
        // Mark voter as having voted
        voters = voters.map(v => 
          v.id === voterId ? { ...v, hasVoted: true } : v
        );
        
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
};

export const getVotingResults = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = candidates.map(candidate => {
        const voteCount = votes.filter(v => v.candidateId === candidate.id).length;
        return {
          ...candidate,
          votes: voteCount,
        };
      });
      
      resolve({
        results,
        totalVotes: votes.length,
        totalVoters: voters.length,
        voterTurnout: votes.length / voters.filter(v => v.status === "approved").length,
      });
    }, 800);
  });
};

export const adminLogin = async (
  username: string,
  password: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === adminCredentials.username && 
          password === adminCredentials.password) {
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

// Mock function for face recognition
export const verifyFaceMatch = async (
  faceImage: string,
  registeredFaceImage: string
): Promise<boolean> => {
  // In a real app, this would use face_recognition to compare encodings
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo, just return true 80% of the time
      resolve(Math.random() > 0.2);
    }, 2000);
  });
};
