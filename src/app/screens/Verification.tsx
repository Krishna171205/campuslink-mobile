import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UploadCloud, CheckCircle2, ShieldCheck, Camera } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function Verification() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const [idFile, setIdFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVerified = user.verificationStatus === "VERIFIED";

  const handleSimulateUpload = (type: "id" | "selfie") => {
    if (type === "id") setIdFile("student_id_front.jpg");
    else setSelfieFile("selfie_live_capture.jpg");
  };

  const handleSubmit = () => {
    if (!idFile || !selfieFile) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setUser({ ...user, verificationStatus: "VERIFIED" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAF8] relative overflow-y-auto">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/80 border-b border-slate-200/50 shadow-sm backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 cursor-pointer text-slate-700 shadow-sm"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">Verification</h1>
        </div>
      </header>

      <div className="p-6 space-y-6 pb-24">
        {isVerified ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center space-y-4"
          >
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-500 shadow-lg">
              <ShieldCheck size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">You're Verified</h2>
            <p className="text-sm font-semibold text-slate-500 max-w-xs">
              Your academic identity is verified. You now have full access to create $CERN tasks and unlock all platform features.
            </p>
            <div className="neo-glass-card p-4 mt-4 w-full flex items-center gap-3">
              <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500" />
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 uppercase">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{user.college}</p>
              </div>
              <div className="ml-auto text-emerald-500">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex gap-3">
              <ShieldCheck size={24} className="text-blue-500 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase">Unlock $CERN Economy</h4>
                <p className="text-[10px] font-semibold text-slate-600 mt-1 leading-snug">
                  Upload your valid college ID to prove you are an active student. This keeps our ecosystem safe and academic-only.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* College ID Upload */}
              <div 
                onClick={() => handleSimulateUpload("id")}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  idFile ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {idFile ? (
                  <div className="flex flex-col items-center text-emerald-600">
                    <CheckCircle2 size={28} className="mb-2" />
                    <span className="text-xs font-bold">{idFile}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <UploadCloud size={28} className="mb-2 text-slate-400" />
                    <span className="text-xs font-bold uppercase">Upload Student ID</span>
                    <span className="text-[9px] font-semibold mt-1">JPEG/PNG. Must show expiry date.</span>
                  </div>
                )}
              </div>

              {/* Selfie Upload */}
              <div 
                onClick={() => handleSimulateUpload("selfie")}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  selfieFile ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {selfieFile ? (
                  <div className="flex flex-col items-center text-emerald-600">
                    <CheckCircle2 size={28} className="mb-2" />
                    <span className="text-xs font-bold">{selfieFile}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Camera size={28} className="mb-2 text-slate-400" />
                    <span className="text-xs font-bold uppercase">Take a Selfie</span>
                    <span className="text-[9px] font-semibold mt-1">Matches face with your ID photo.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={!idFile || !selfieFile || isSubmitting}
                className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_rgba(15,23,42,1)] border-2 border-slate-900 cursor-pointer ${
                  (!idFile || !selfieFile) ? "bg-slate-200 text-slate-400 border-slate-300 shadow-none cursor-not-allowed" 
                  : "bg-slate-900 text-white"
                }`}
              >
                {isSubmitting ? "Verifying..." : "Submit Verification"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
