import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { LogIn } from "lucide-react";


function Login() {
    const { currentUser, isStaff } = useAuth();

    //redirect if already logged in
    if (currentUser) {
        return <Navigate to= {isStaff ? "/dashboard" : "/"} />; 
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gunmetal flex items-center justify-center">
                <LogIn className="w-8 h-8 mr-3 text-asparagus" />
                Login
            </h1>
            <LoginForm />
            <p className="mt-4 text-center text-payne-gray">
                Don't have an account?{" "}
                <Link to="/signup" className="text-asparagus hover:text-gold hover:underline transition-colors duration-200">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

export default Login;