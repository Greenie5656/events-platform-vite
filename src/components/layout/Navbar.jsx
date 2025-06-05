import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Calendar, User, LogOut, Home, Settings } from "lucide-react";

function Navbar() {
    const { currentUser, isStaff } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className="bg-gunmetal shadow-lg border-b-2 border-asparagus">
            <div className="w-full mx-auto px-4 py-4">
                <div className="flex justify-between items-center min-w-0">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center space-x-2 text-snow hover:text-asparagus transition-colors duration-200">
                        <Calendar className="h-8 w-8" />
                        <span className="text-2xl font-bold">Eventra</span>
                        <span className="text-sm bg-asparagus text-gunmetal px-2 py-1 rounded-full font-medium">Beta</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2 md:space-x-6">
                        <Link 
                            to="/" 
                            className="flex items-center space-x-1 text-snow hover:text-asparagus transition-colors duration-200 font-medium"
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Link>

                        {currentUser ? (
                            <>
                                {isStaff && (
                                    <Link 
                                        to="/dashboard" 
                                        className="flex items-center space-x-1 text-snow hover:text-asparagus transition-colors duration-200 font-medium"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                                
                                <div className="flex items-center space-x-2 md:space-x-3">
                                    <div className="flex items-center space-x-1 text-asparagus">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm font-medium hidden sm:block">{currentUser.email}</span>
                                    </div>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 bg-payne-gray hover:bg-asparagus text-snow px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="hidden sm:block">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/login" 
                                    className="text-snow hover:text-asparagus transition-colors duration-200 font-medium px-3 py-2"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="bg-asparagus hover:bg-gold text-gunmetal px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;