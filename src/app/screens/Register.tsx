import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";

export function Register() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return; // Basic validation handling
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mock registration
      setUser(prev => ({
        ...prev,
        name: name || prev.name,
      }));
      navigate("/profile-setup");
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      // Simulate Google Auth
      navigate("/profile-setup");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent p-6 relative overflow-y-auto no-scrollbar justify-center">
      <div className="max-w-sm mx-auto w-full relative z-10 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="neo-glass-card-important p-8 relative bg-white/95"
        >
          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-[#10B981] rounded-[14px] flex items-center justify-center relative z-10 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                  <div className="w-6 h-6 border-[2.5px] border-slate-900 rounded-full bg-[#FACC15] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">CampusLink</h1>
            </motion.div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1.5 tracking-tight uppercase leading-tight">Create Account</h2>
            <p className="text-slate-500 text-sm font-semibold max-w-[240px] leading-relaxed mx-auto">
              Join the ultimate student economy.
            </p>
          </div>

          <div className="space-y-5">
            {/* Standard Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex R."
                  className="w-full input-neo-glass"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full input-neo-glass"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full input-neo-glass mb-3"
                  required
                />
                
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-widest">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full input-neo-glass ${confirmPassword && password !== confirmPassword ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-red-200' : ''}`}
                    required
                  />
                  <AnimatePresence>
                    {confirmPassword && password !== confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-5 left-1 text-[10px] font-bold text-red-500"
                      >
                        Passwords do not match
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                disabled={loading || googleLoading || (confirmPassword !== "" && password !== confirmPassword)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full bg-[#10b981] border-2 border-slate-950 rounded-[18px] py-4 flex items-center justify-center gap-3 font-extrabold text-white shadow-[3px_3px_0px_rgba(15,23,42,1)] hover:bg-slate-800 cursor-pointer text-sm transition-all mt-2 ${loading || googleLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-700 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">or sign up with</span>
              </div>
            </div>

            {/* Google Sign-in CTA */}
            <motion.button
              disabled={loading || googleLoading}
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={`w-full bg-white border-2 border-slate-900 rounded-[18px] py-4 flex items-center justify-center gap-3 font-extrabold text-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)] hover:bg-slate-50 cursor-pointer text-sm transition-all ${loading || googleLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.79 16.79 15.62 17.57V20.34H19.18C21.07 18.6 22.56 15.67 22.56 12.25Z" fill="#EA4335" />
                  <path d="M12 23C14.97 23 17.16 22.01 18.74 20.34L15.18 17.57C14.33 18.15 13.25 18.5 12 18.5C9.57 18.5 7.27 16.86 6.44 14.65H2.78V17.49C4.54 21.01 8.08 23 12 23Z" fill="#34A853" />
                  <path d="M6.44 14.65C6.23 13.99 6.11 13.3 6.11 12.6C6.11 11.89 6.23 11.21 6.44 10.55V7.71H2.78C2.06 9.15 1.63 10.82 1.63 12.6C1.63 14.37 2.06 16.05 2.78 17.49L6.44 14.65Z" fill="#FBBC05" />
                  <path d="M12 6.5C13.62 6.5 15.06 7.05 16.2 8.13L19.26 5.07C17.15 3.06 14.97 2 12 2C8.08 2 4.54 3.99 2.78 7.71L6.44 10.55C7.27 8.34 9.57 6.5 12 6.5Z" fill="#4285F4" />
                </svg>
              )}
              {googleLoading ? "Signing in..." : "Google"}
            </motion.button>

            {/* Collapsible Referral Option */}
            <div className="text-center pt-2">
              <button
                onClick={() => setShowReferral(!showReferral)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest inline-flex items-center gap-1.5 cursor-pointer"
              >
                Have a referral code?
                {showReferral ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {showReferral && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <input
                      type="text"
                      placeholder="e.g. CAMPUS-XXXX"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full input-neo-glass text-center uppercase tracking-widest text-xs font-mono"
                    />
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Unlock +100 CERN on sign-up</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-center text-xs font-bold text-slate-600 mt-2">
              Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}