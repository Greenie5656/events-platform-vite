import SignupForm from "../components/auth/SignupForm";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


function Signup(){
    const { currentUser, isStaff } = useAuth();

    //redirect if already logged in
    if (currentUser) {
        return <Navigate to={isStaff ? "/dashboard" : "/"} />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Create Account</h1>
            <SignupForm />
            <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                Log In
                </Link>
            </p>
        </div>
    );
}

export default Signup;