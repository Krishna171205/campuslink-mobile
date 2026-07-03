import { useNavigate } from "react-router";
import { Users, Search, Hash, MessageCircle, Flame, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const mockGroups = [
  { id: 1, name: "CS Majors 2026", members: 342, active: 12, topic: "Academics" },
  { id: 2, name: "Design Enthusiasts", members: 156, active: 5, topic: "Design" },
  { id: 3, name: "Freelance Hustle", members: 890, active: 45, topic: "General" },
];

const mockDiscussions = [
  { id: 101, title: "Best places to study after midnight?", author: "Sarah T.", replies: 24, hot: true },
  { id: 102, title: "Anyone need a React developer for their final project?", author: "Amit P.", replies: 8, hot: false },
];

export function Community() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"discussions" | "groups">("discussions");

  return (
    <div className="flex flex-col h-full bg-[#E2E8F0]/30 absolute inset-0 z-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/80 border-b border-slate-200/50 shadow-sm backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm shrink-0">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Community</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-100 transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex gap-4">
        <button 
          onClick={() => setActiveTab("discussions")}
          className={`pb-2 text-sm font-bold transition-colors relative ${
            activeTab === "discussions" ? "text-slate-900" : "text-slate-400"
          }`}
        >
          Discussions
          {activeTab === "discussions" && (
            <motion.div layoutId="communityTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab("groups")}
          className={`pb-2 text-sm font-bold transition-colors relative ${
            activeTab === "groups" ? "text-slate-900" : "text-slate-400"
          }`}
        >
          Study Groups
          {activeTab === "groups" && (
            <motion.div layoutId="communityTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {activeTab === "discussions" && (
          <div className="space-y-3">
            {mockDiscussions.map((disc, idx) => (
              <motion.div 
                key={disc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug pr-4">{disc.title}</h3>
                      {disc.hot && <Flame size={16} className="text-rose-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>By {disc.author}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-emerald-600">{disc.replies} Replies</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="space-y-3">
            {mockGroups.map((group, idx) => (
              <motion.div 
                key={group.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 border border-slate-200">
                    <Hash size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{group.name}</h3>
                    <p className="text-xs font-medium text-slate-500">{group.members} members • {group.active} online</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                  Join
                </button>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}