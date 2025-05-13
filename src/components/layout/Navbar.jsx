import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
    const { currentUser, isStaff } = useAuth();

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Events Platform</Link>
                <div className="space-x-4">
                    <Link to="/" className="hoover:text-gray-300">Home</Link>
                    {currentUser ? (
                        <>
                            {isStaff && <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>}
                            <button className="hover:text-gray-300">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;