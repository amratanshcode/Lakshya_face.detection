
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, User, Vote, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="py-12 bg-gradient-to-b from-secondary to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Secure Voting System
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Vote securely with advanced facial recognition technology
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-md shadow">
                  Register Now
                </Button>
              </Link>
              <Link to="/vote">
                <Button size="lg" variant="outline" className="rounded-md">
                  Cast Your Vote
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <User className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Register Your Face</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Create an account with your details and register your face securely.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Verify Identity</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Our system uses facial recognition to verify your identity quickly.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Vote className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Cast Your Vote</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Vote securely and confidently knowing your identity is protected.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="py-12 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join our secure voting platform today and experience the future of democratic participation.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="rounded-md">
                Register as a Voter
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2023 FaceVote - Secure Voting System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
