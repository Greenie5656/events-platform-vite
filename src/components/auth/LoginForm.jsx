import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState("");
    const navigate = useNavigate();
    const { isStaff, resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // redirect based on userrole
            // we need to wait a moment for the authcontext to update with user role
            setTimeout(() => {
                if (isStaff) {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
            }, 500)
        } catch (error) {
            setError(
                error.code === "auth/invalid-credential" 
                        ? "Invalid email or password"
                        : "Failed login. Please try again"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first");
            return;
        }

        setResetLoading(true);
        setError("");
        setResetMessage("");

        try {
            await resetPassword(email);
            setResetMessage("Password reset email sent! Check your inbox.");
        } catch (error) {
            setError("Failed to send reset email. Please check your email address");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gunmetal">Log In</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-lg">{error}</div>}
            {resetMessage && <div className="bg-asparagus/10 border border-asparagus/30 text-asparagus p-3 mb-4 rounded-lg">{resetMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gunmetal">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
                    required
                />
               </div>
               <div>
               <label htmlFor="password" className="block mb-1 text-sm font-medium text-gunmetal">
                Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
                    required
                />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-asparagus text-snow py-3 rounded-lg font-medium transition-colors duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gold"
          }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-center">
            <button
             onClick={handleForgotPassword}
             disabled={resetLoading}
             className="text-asparagus hover:text-gold hover:underline text-sm transition-colors duration-200"
            >
                {resetLoading ? "Sending... " : "Forgot Password"}
            </button>
            </div>
        </div>
    );
}

export default LoginForm;