import { useState } from "react";
import { useNavigate } from "react-router";
import { Trophy, ChevronUp, ChevronDown, Sparkles, Medal, Award, Flame, UserCheck, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

export function Leaderboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<"reputation" | "cern" | "tasks">("reputation");
  const [period, setPeriod] = useState("This Month");

  // Roster lists for different categories
  const ROSTERS = {
    reputation: [
      { rank: 1, name: "Alex R.", score: "4,850 pts", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "UI/UX Developer" },
      { rank: 2, name: "Sarah M.", score: "4,200 pts", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", trend: "same", detail: "Figma Expert" },
      { rank: 3, name: "David K.", score: "3,950 pts", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "Data Scientist" },
      { rank: 4, name: "Emily L.", score: "3,100 pts", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", trend: "down", detail: "Writer" },
      { rank: 5, name: "Jessica T.", score: "2,850 pts", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "Math Tutor" },
      { rank: 6, name: "Rahul S.", score: "2,400 pts", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", trend: "same", detail: "Python Dev" }
    ],
    cern: [
      { rank: 1, name: "Sarah M.", score: "890 CERN", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "Figma Expert" },
      { rank: 2, name: "David K.", score: "620 CERN", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", trend: "down", detail: "Data Scientist" },
      { rank: 3, name: "Alex R.", score: "340 CERN", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", trend: "same", detail: "UI/UX Developer" },
      { rank: 4, name: "Rahul S.", score: "310 CERN", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "Python Dev" },
      { rank: 5, name: "Emily L.", score: "250 CERN", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", trend: "down", detail: "Writer" },
      { rank: 6, name: "Jessica T.", score: "180 CERN", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "Math Tutor" }
    ],
    tasks: [
      { rank: 1, name: "Rahul S.", score: "34 Tasks", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "Python Dev" },
      { rank: 2, name: "Jessica T.", score: "28 Tasks", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", trend: "same", detail: "Math Tutor" },
      { rank: 3, name: "Alex R.", score: "24 Tasks", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "UI/UX Developer" },
      { rank: 4, name: "Sarah M.", score: "19 Tasks", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", trend: "down", detail: "Figma Expert" },
      { rank: 5, name: "David K.", score: "15 Tasks", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", trend: "same", detail: "Data Scientist" },
      { rank: 6, name: "Emily L.", score: "11 Tasks", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", trend: "up", detail: "Writer" }
    ]
  };

  const list = ROSTERS[activeTab];
  const topThreeList = list.slice(0, 3);
  const remainingList = list.slice(3);

  // Reorder for podium presentation: silver (#2), gold (#1), bronze (#3)
  const podiumSilver = topThreeList.find(x => x.rank === 2);
  const podiumGold = topThreeList.find(x => x.rank === 1);
  const podiumBronze = topThreeList.find(x => x.rank === 3);

  return (
    <div className="flex flex-col min-h-full bg-transparent relative overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-[#F8FAF8]/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50">
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
              Leaderboard 
              <span className="bg-emerald-500 border border-emerald-600/30 p-1.5 rounded-lg inline-flex items-center justify-center text-white">
                <Trophy size={16} />
              </span>
            </h1>
          </div>
          
          {/* Time Picker Dropdown */}
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-slate-700 focus:outline-none"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
        </div>

        {/* Tab Row */}
        <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 text-[9px] font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("reputation")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer font-black uppercase tracking-widest text-[10px] ${
              activeTab === "reputation" ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" : "text-slate-500"
            }`}
          >
            Reputation
          </button>
          <button
            onClick={() => setActiveTab("cern")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer font-black uppercase tracking-widest text-[10px] ${
              activeTab === "cern" ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" : "text-slate-500"
            }`}
          >
            CERN
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer font-black uppercase tracking-widest text-[10px] ${
              activeTab === "tasks" ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" : "text-slate-500"
            }`}
          >
            Tasks
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Podium Design Display */}
        <div className="flex justify-center items-end gap-2.5 pt-6 pb-2 min-h-[190px] border-b border-slate-200/50">
          
          {/* Silver #2 */}
          {podiumSilver && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              key={`silver-${activeTab}`}
              className="flex-1 flex flex-col items-center max-w-[95px] text-center"
            >
              <div className="relative mb-2">
                <img 
                  src={podiumSilver.avatar} 
                  alt={podiumSilver.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-300"
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-400 border border-slate-550 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                  #2
                </span>
              </div>
              <h4 className="font-extrabold text-[10px] text-slate-800 leading-tight uppercase truncate w-full">{podiumSilver.name.split(" ")[0]}</h4>
              <span className="text-[9px] text-slate-450 font-bold block mt-0.5">{podiumSilver.score}</span>
              
              {/* Podium Block Visual */}
              <div className="w-full bg-slate-200 border-t-2 border-x border-slate-350 h-10 rounded-t-xl mt-3 flex items-center justify-center font-black text-slate-400 text-sm">
                II
              </div>
            </motion.div>
          )}

          {/* Gold #1 */}
          {podiumGold && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              key={`gold-${activeTab}`}
              className="flex-1 flex flex-col items-center max-w-[105px] text-center relative -top-2"
            >
              <div className="relative mb-2">
                <img 
                  src={podiumGold.avatar} 
                  alt={podiumGold.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-yellow-400 border border-slate-900 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center justify-center">
                  <Sparkles size={8} className="text-slate-900 shrink-0 mr-0.5" />
                  #1
                </span>
              </div>
              <h4 className="font-black text-xs text-slate-900 leading-tight uppercase truncate w-full flex items-center justify-center gap-0.5">
                {podiumGold.name.split(" ")[0]}
              </h4>
              <span className="text-[10px] text-emerald-650 font-black block mt-0.5">{podiumGold.score}</span>
              
              {/* Podium Block Visual */}
              <div className="w-full bg-[#10B981]/15 border-t-2 border-x border-emerald-500 h-14 rounded-t-xl mt-3 flex flex-col items-center justify-center font-black text-emerald-600 text-lg shadow-inner">
                I
              </div>
            </motion.div>
          )}

          {/* Bronze #3 */}
          {podiumBronze && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              key={`bronze-${activeTab}`}
              className="flex-1 flex flex-col items-center max-w-[95px] text-center"
            >
              <div className="relative mb-2">
                <img 
                  src={podiumBronze.avatar} 
                  alt={podiumBronze.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-350"
                />
                <span className="absolute -bottom-1 -right-1 bg-orange-400 border border-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                  #3
                </span>
              </div>
              <h4 className="font-extrabold text-[10px] text-slate-800 leading-tight uppercase truncate w-full">{podiumBronze.name.split(" ")[0]}</h4>
              <span className="text-[9px] text-slate-450 font-bold block mt-0.5">{podiumBronze.score}</span>
              
              {/* Podium Block Visual */}
              <div className="w-full bg-slate-200 border-t-2 border-x border-slate-350 h-7 rounded-t-xl mt-3 flex items-center justify-center font-black text-slate-400 text-xs">
                III
              </div>
            </motion.div>
          )}
        </div>

        {/* Scrollable list for rankings #4 onwards */}
        <div className="space-y-2.5">
          {remainingList.map(item => {
            const isMe = item.name === user.name;
            
            return (
              <div
                key={item.rank}
                className={`neo-glass-card p-4 flex items-center justify-between hover:border-slate-350 transition-all shadow-none ${
                  isMe ? "border-2 border-slate-900 bg-emerald-50/50" : ""
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 border border-slate-200">
                    #{item.rank}
                  </div>
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs uppercase">{item.name}</h5>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.detail}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-xs text-slate-800 bg-white border px-2.5 py-1 rounded-lg">
                    {item.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}