import { useNavigate } from "react-router";
import { ArrowLeft, Gift, Trophy, Star, Zap, Lock, Medal, Target } from "lucide-react";
import { motion } from "framer-motion";

const rewards = [
  {
    id: 1,
    title: "First Blood",
    desc: "Complete your first task.",
    icon: <Star size={24} fill="currentColor" />,
    color: "bg-amber-100 text-amber-500 border-amber-300",
    unlocked: true,
  },
  {
    id: 2,
    title: "Big Earner",
    desc: "Earn your first 1000 CERN.",
    icon: <Zap size={24} fill="currentColor" />,
    color: "bg-emerald-100 text-emerald-500 border-emerald-300",
    unlocked: true,
  },
  {
    id: 3,
    title: "Top 10%",
    desc: "Rank in top 10% this week.",
    icon: <Trophy size={24} />,
    color: "bg-purple-100 text-purple-500 border-purple-300",
    unlocked: false,
  },
  {
    id: 4,
    title: "Campus Legend",
    desc: "Complete 50 tasks with 5-stars.",
    icon: <Gift size={24} />,
    color: "bg-blue-100 text-blue-500 border-blue-300",
    unlocked: false,
  },
  {
    id: 5,
    title: "Sharpshooter",
    desc: "Finish 5 tasks without any revisions.",
    icon: <Target size={24} />,
    color: "bg-rose-100 text-rose-500 border-rose-300",
    unlocked: false,
  },
  {
    id: 6,
    title: "Social Butterfly",
    desc: "Refer 5 friends to the platform.",
    icon: <Medal size={24} />,
    color: "bg-indigo-100 text-indigo-500 border-indigo-300",
    unlocked: false,
  }
];

export function Rewards() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] absolute inset-0 z-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/80 border-b-2 border-slate-900 shadow-sm backdrop-blur-md flex items-center gap-4 sticky top-0 z-20">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-slate-900 cursor-pointer text-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </motion.button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Rewards</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-24">
        
        {/* Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                <Trophy size={14} className="text-emerald-500" /> Current Tier
              </h2>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black tracking-tighter leading-none text-slate-900">Silver</span>
                <span className="text-[10px] font-black text-slate-900 pb-1 bg-emerald-100 px-2.5 py-1 rounded-lg border-2 border-slate-900">Lvl 4</span>
              </div>
            </div>
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <span>120 / 250 XP to Gold</span>
                <span className="text-emerald-600">48%</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden border-2 border-slate-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "48%" }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-r-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex items-center justify-between relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-amber-50 rounded-xl border-2 border-slate-900 flex items-center justify-center text-amber-500 shrink-0">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase leading-none mb-1.5">5 Day Streak!</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-snug">Keep it up for 2x multiplier.</p>
            </div>
          </div>
        </motion.div>

        {/* Badges Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Your Badges</h3>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider bg-[#10b981] border-2 border-slate-900 px-3 py-1 rounded-full shadow-[2px_2px_0px_rgba(15,23,42,1)]">
              2/6 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {rewards.map((reward, idx) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className={`p-5 rounded-[20px] border-2 flex flex-col items-center text-center relative overflow-hidden ${
                  reward.unlocked 
                    ? "bg-white border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)]" 
                    : "bg-slate-50 border-slate-200 shadow-none opacity-60"
                }`}
              >
                {!reward.unlocked && (
                  <div className="absolute top-3 right-3 text-slate-400">
                    <Lock size={14} />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border-2 ${reward.unlocked ? reward.color : 'bg-slate-100 border-slate-200 text-slate-400 grayscale'}`}>
                  {reward.icon}
                </div>
                <h4 className={`font-black text-xs uppercase mb-1 leading-tight ${reward.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>{reward.title}</h4>
                <p className={`text-[9px] font-bold uppercase tracking-wider leading-snug ${reward.unlocked ? 'text-slate-500' : 'text-slate-400'}`}>{reward.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
