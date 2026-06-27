import { useNavigate } from "react-router";
import { ArrowLeft, Share2, Copy, Users, Coins } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function Referral() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const referralCode = "CAMPUS2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 absolute inset-0 z-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/80 border-b border-slate-200/50 shadow-sm backdrop-blur-md flex items-center gap-4 sticky top-0 z-10">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 cursor-pointer text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </motion.button>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Refer & Earn</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Banner */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] relative overflow-hidden text-center">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-100 border-2 border-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users size={28} strokeWidth={2.5} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Invite Friends</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 max-w-[200px] mx-auto">
              Get 50 CERN when a friend signs up and completes a task.
            </p>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Invite Code</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl p-3 flex items-center justify-center">
                <span className="font-mono font-black text-slate-900 tracking-wider text-lg">{referralCode}</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`w-14 h-[52px] rounded-xl flex items-center justify-center transition-colors border-2 cursor-pointer shadow-[3px_3px_0px_rgba(15,23,42,1)] ${
                  copied 
                    ? "bg-emerald-50 border-slate-900 text-emerald-600" 
                    : "bg-slate-900 border-slate-900 text-white"
                }`}
              >
                {copied ? <span className="text-[10px] font-black uppercase">Copied</span> : <Copy size={20} />}
              </motion.button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">or</span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-slate-900 p-4 rounded-xl font-black uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)] transition-colors cursor-pointer"
          >
            <Share2 size={18} strokeWidth={2.5} className="text-emerald-600" />
            Share Invite Link
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl font-black text-slate-900">0</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Friends Invited</div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-black text-emerald-500">
              0 <Coins size={16} strokeWidth={3} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">CERN Earned</div>
          </div>
        </div>

      </div>
    </div>
  );
}
