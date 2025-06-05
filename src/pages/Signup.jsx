import SignupForm from "../components/auth/SignupForm";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { UserPlus } from "lucide-react";


function Signup(){
    const { currentUser, isStaff } = useAuth();

    //redirect if already logged in
    if (currentUser) {
        return <Navigate to={isStaff ? "/dashboard" : "/"} />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gunmetal flex items-center justify-center">
                <UserPlus className="w-8 h-8 mr-3 text-asparagus" />
                Create Account
            </h1>
            <SignupForm />
            <p className="mt-4 text-center text-payne-gray">
                Already have an account?{" "}
                <Link to="/login" className="text-asparagus hover:text-gold hover:underline transition-colors duration-200">
                Log In
                </Link>
            </p>
        </div>
    );
}

export default Signup;