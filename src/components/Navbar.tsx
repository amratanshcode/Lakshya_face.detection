
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, User, Vote } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">FaceVote</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/register">
              <Button variant="ghost" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Register
              </Button>
            </Link>
            <Link to="/vote">
              <Button variant="ghost" className="flex items-center">
                <Vote className="mr-2 h-4 w-4" />
                Vote
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" className="flex items-center">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
