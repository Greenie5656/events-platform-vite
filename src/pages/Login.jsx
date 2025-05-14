import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function Login() {
    const { currentUser, isStaff } = useAuth();

    //redirect if already logged in
    if (currentUser) {
        return <Navigate to= {isStaff ? "/dashboard" : "/"} />; 
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Login</h1>
            <LoginForm />
            <p className="mt-4 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

export default Login;