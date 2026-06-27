import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center relative z-10"
      >
        <div className="w-24 h-24 bg-[#10B981] rounded-[28px] flex items-center justify-center mb-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#0F172A" fillOpacity="0.25"/>
            <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="#FACC15"/>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white drop-shadow-sm uppercase">CampusLink</h1>
        <p className="text-yellow-300 font-extrabold tracking-widest text-[10px] uppercase bg-slate-900/35 px-4 py-1.5 rounded-xl border border-white/10 mb-8">The Campus OS</p>
        
        {/* Subtle loading spinner */}
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </motion.div>
    </div>
  );
}
