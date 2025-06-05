import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

function SignupForm () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("member");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        //validate password match
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        //validate password strength
        if (password.length < 6) {
            return setError("Password must be at least 6 characters")
        }

        setLoading(true);

        try {
            //create user in firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //store additional user data in firestore
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                role,
                createdAt: new Date()
            });

            //redirect based on role
            if (role === "staff"){
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            if (error.code === "auth/email-already-in-use"){
                setError("Email is already in use")
            } else {
                setError("Failed to create an account. Please try again.");
                console.error("Signup error", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gunmetal">Join the Community</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-lg">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gunmetal">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
                        required
                        />
                </div>
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
                <div>
                    <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gunmetal">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gunmetal">Account Type</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center text-sm text-gunmetal">
                            <input
                            type="radio"
                            value="member"
                            checked={role=== "member"}
                            onChange={() => setRole("member")}
                            className="mr-2 text-asparagus focus:ring-asparagus"
                        />
                        Community Member
                        </label>
                        <label className="flex items-center text-sm text-gunmetal">
                            <input
                            type="radio"
                            value="staff"
                            checked={role=== "staff"}
                            onChange={() => setRole("staff")}
                            className="mr-2 text-asparagus focus:ring-asparagus"
                        />
                        Event Organizer (Staff)
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-asparagus text-snow py-3 rounded-lg font-medium transition-colors duration-200 ${
  loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gold"
          }`}
          >
            {loading? "Creating Account..." : "Sign Up"}
          </button>

            </form>
        </div>
    );

}

export default SignupForm;