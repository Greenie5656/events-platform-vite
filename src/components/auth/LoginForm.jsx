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
    const navigate = useNavigate();
    const { isStaff } = useAuth();

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

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Log In</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
               </div>
               <div>
               <label htmlFor="password" className="block mb-1">
                Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white py-2 rounded ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        </div>
    );
}

export default LoginForm;