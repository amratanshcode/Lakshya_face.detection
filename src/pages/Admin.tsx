
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import VoterCard, { Voter } from "@/components/VoterCard";
import { adminLogin, approveVoter, getVoters, getVotingResults, rejectVoter } from "@/utils/api";
import { Shield, User, Vote } from "lucide-react";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [results, setResults] = useState<any | null>(null);
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await adminLogin(username, password);
      
      if (success) {
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        });
        
        // Load initial data
        await fetchVoters();
        await fetchResults();
        
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchVoters = async () => {
    try {
      const votersData = await getVoters();
      setVoters(votersData);
    } catch (error) {
      console.error("Error fetching voters:", error);
      toast({
        title: "Error",
        description: "Could not load voter data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const fetchResults = async () => {
    try {
      const resultsData = await getVotingResults();
      setResults(resultsData);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast({
        title: "Error",
        description: "Could not load voting results. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleApproveVoter = async (id: string) => {
    try {
      const updatedVoters = await approveVoter(id);
      setVoters(updatedVoters);
      toast({
        title: "Voter Approved",
        description: "The voter has been approved and can now vote.",
      });
    } catch (error) {
      console.error("Error approving voter:", error);
      toast({
        title: "Error",
        description: "Could not approve voter. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectVoter = async (id: string) => {
    try {
      const updatedVoters = await rejectVoter(id);
      setVoters(updatedVoters);
      toast({
        title: "Voter Rejected",
        description: "The voter has been rejected and cannot vote.",
      });
    } catch (error) {
      console.error("Error rejecting voter:", error);
      toast({
        title: "Error",
        description: "Could not reject voter. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const pendingVoters = voters.filter(voter => voter.status === "pending");
  const approvedVoters = voters.filter(voter => voter.status === "approved");
  const rejectedVoters = voters.filter(voter => voter.status === "rejected");
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Username</label>
                  <Input 
                    id="username" 
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                
                <div className="p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
                  <p className="font-medium">Demo Credentials</p>
                  <p>Username: admin</p>
                  <p>Password: admin123</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage voters and view election results
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Voters</p>
                    <p className="text-3xl font-bold">{voters.length}</p>
                  </div>
                  <User className="h-8 w-8 text-primary opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    <p className="text-3xl font-bold">{pendingVoters.length}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">{pendingVoters.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Votes Cast</p>
                    <p className="text-3xl font-bold">{results?.totalVotes || 0}</p>
                  </div>
                  <Vote className="h-8 w-8 text-primary opacity-70" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="voters">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="voters">Manage Voters</TabsTrigger>
              <TabsTrigger value="results">Voting Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="voters">
              <Card>
                <CardHeader>
                  <CardTitle>Voter Management</CardTitle>
                  <CardDescription>
                    Approve or reject voter registrations and manage existing voters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pending">
                    <TabsList>
                      <TabsTrigger value="pending" className="relative">
                        Pending
                        {pendingVoters.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {pendingVoters.length}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pending" className="pt-4">
                      {pendingVoters.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No pending voters to approve</p>
                        </div>
                      ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {pendingVoters.map(voter => (
                            <VoterCard 
                              key={voter.id} 
                              voter={voter}
                              onApprove={handleApproveVoter}
                              onReject={handleRejectVoter}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="approved" className="pt-4">
                      {approvedVoters.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No approved voters yet</p>
                        </div>
                      ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {approvedVoters.map(voter => (
                            <VoterCard key={voter.id} voter={voter} />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="rejected" className="pt-4">
                      {rejectedVoters.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No rejected voters</p>
                        </div>
                      ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {rejectedVoters.map(voter => (
                            <VoterCard key={voter.id} voter={voter} />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Election Results</CardTitle>
                  <CardDescription>
                    View the current results of the election
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Vote Distribution</h3>
                        <div className="space-y-4">
                          {results.results.map((result: any) => {
                            const percentage = results.totalVotes > 0 
                              ? (result.votes / results.totalVotes) * 100 
                              : 0;
                              
                            return (
                              <div key={result.id}>
                                <div className="flex justify-between items-center mb-1">
                                  <div>
                                    <span className="font-medium">{result.name}</span>
                                    <span className="text-sm text-muted-foreground ml-2">
                                      {result.party}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium">
                                    {result.votes} votes ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-muted-foreground">
                                Voter Turnout
                              </p>
                              <p className="text-lg font-bold">
                                {(results.voterTurnout * 100).toFixed(1)}%
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-muted-foreground">
                                Total Votes Cast
                              </p>
                              <p className="text-lg font-bold">
                                {results.totalVotes}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading results...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
