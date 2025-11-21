import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Book, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const firebaseConfig = {
 //replace with your firebase api details 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

function AuthPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth Page Loaded ✅");
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User signed in:", result.user);
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      setUser(userCredential.user);
      console.log("User authenticated:", userCredential.user);
      navigate("/home");
    } catch (error) {
      console.error("Error with email authentication:", error);
      alert(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 overflow-hidden">
      {/* Floating Book Animations */}
      {[...Array(10)].map((_, i) => (
        <motion.div 
          key={i}
          className="absolute text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        >
          <Book size={40} strokeWidth={1.2} />
        </motion.div>
      ))}

      {/* Top Section Enhancement */}
      <div className="absolute top-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold">EduSync</h1>
        <p className="text-lg text-gray-200 mt-2">Empowering your learning journey</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-lg w-full bg-white/20 backdrop-blur-lg text-gray-900 p-8 rounded-3xl shadow-2xl transform transition-all border border-white/30"
      >
        <h1 className="text-4xl font-bold mb-6 text-white text-center">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        {user ? (
          <h2 className="text-lg text-gray-300 text-center">Welcome, {user.displayName}!</h2>
        ) : (
          <>
            <button 
              onClick={signInWithGoogle} 
              className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 mb-4 shadow-md hover:bg-gray-100 transition-all"
            >
              <FcGoogle className="w-6 h-6" /> Sign in with Google
            </button>
            <form onSubmit={handleEmailAuth} className="w-full">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-10 w-full p-3 mb-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pl-10 w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>
            <p className="text-sm mt-4 text-gray-300 text-center cursor-pointer hover:underline" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AuthPage;
