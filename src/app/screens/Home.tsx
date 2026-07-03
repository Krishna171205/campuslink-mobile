import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Search, Plus, ArrowRight, Wallet, ClipboardList, AlertCircle, Calendar, TrendingUp, Tag, Coffee, Laptop, Car, Trophy, Users } from "lucide-react";
import { useApp } from "../context/AppContext";

export function Home() {
  const navigate = useNavigate();
  const { user, tasks, notifications } = useApp();

  const activeTasks = tasks.filter(t =>
    (t.helperName === user.name || t.posterName === user.name) &&
    (t.status === "CLAIMED" || t.status === "SUBMITTED" || t.status === "FLAGGED")
  );


  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  const categories = [
    { icon: Coffee, label: "Food", color: "bg-orange-100 text-orange-600" },
    { icon: Laptop, label: "Tech", color: "bg-blue-100 text-blue-600" },
    { icon: Car, label: "Rides", color: "bg-purple-100 text-purple-600" },
    { icon: Tag, label: "Errands", color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div className="flex flex-col min-h-full relative selection:bg-emerald-500 selection:text-white" style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #f8fafc 40%, #ecfdf5 100%)" }}>

      {/* Minimal Header */}
      <header className="px-6 pt-12 pb-8 sticky top-0 z-30 bg-white/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt="Profile"
            onClick={() => navigate("/app/profile")}
            className="w-11 h-11 rounded-full object-cover border border-slate-200 cursor-pointer"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Hi, {user.name.split(" ")[0]}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{today}</p>
          </div>
        </div>

      </header>

      <div className="px-6 space-y-8 pb-32">

        {/* Verification Banner */}
        {user.verificationStatus === "UNVERIFIED" && (
          <div onClick={() => navigate("/app/verification")} className="flex items-center justify-between p-4 bg-emerald-300 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-[16px] cursor-pointer hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-slate-900" strokeWidth={2.5} />
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Verify College ID to earn</span>
            </div>
            <ArrowRight size={20} className="text-slate-900" strokeWidth={2.5} />
          </div>
        )}

        {/* Hero Action - The 30% Brutalist Accent in Green */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/app/create")}
          className="bg-[#10b981] border-2 border-slate-900 rounded-[24px] p-6 shadow-[6px_6px_0px_0px_#0f172a] cursor-pointer relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px] w-[60%]">
            <div>
              <h3 className="text-2xl font-black text-white mb-2 leading-tight">Need a favor<br />on campus?</h3>
              <p className="text-emerald-50 font-medium text-sm mb-6">
                Post a task and let peers handle it.
              </p>
            </div>
            <div className="self-start inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <Plus size={18} strokeWidth={3} />
              <span>Create Task</span>
            </div>
          </div>

          {/* Floating Doodle Student */}
          <motion.img
            src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
            alt="Student Doodle"
            className="absolute -right-2 -bottom-2 w-44 h-44 object-contain z-10 opacity-90 mix-blend-luminosity"
            style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3)) blur(0.5px)" }}
            animate={{ y: [0, -8, 0], rotate: [0, -2, 2, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />

          {/* Decorative shapes */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-400 rounded-full blur-3xl pointer-events-none opacity-50" />
        </motion.div>

        {/* Quick Nav - Brutalist Accent */}
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => navigate("/app/tasks")}
            className="bg-[#fef08a] flex flex-col gap-3 p-5 rounded-[24px] cursor-pointer group transition-all hover:-translate-y-1 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] group-hover:bg-yellow-100 transition-colors">
              <Search size={20} className="text-slate-900" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-base uppercase tracking-tight">Browse</h4>
              <p className="text-xs text-slate-800 font-bold mt-0.5">Find tasks to earn</p>
            </div>
          </div>
          <div
            onClick={() => navigate("/app/community")}
            className="bg-[#c7d2fe] flex flex-col gap-3 p-5 rounded-[24px] cursor-pointer group transition-all hover:-translate-y-1 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] group-hover:bg-indigo-100 transition-colors">
              <Users size={20} className="text-slate-900" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-base uppercase tracking-tight">Community</h4>
              <p className="text-xs text-slate-800 font-bold mt-0.5">Join discussions</p>
            </div>
          </div>
        </div>

        {/* Explore Categories - Interactive Horizontal Scroll */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Explore</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/app/tasks?category=${cat.label}`)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full cursor-pointer whitespace-nowrap transition-all group"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${cat.color} group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors`}>
                    <Icon size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{cat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Weekly Stats - Brutalist Accent */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate("/app/wallet")}
          className="bg-white rounded-[24px] p-5 flex items-center justify-between cursor-pointer transition-all group hover:-translate-y-1 border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]"
        >
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Earned this week</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">450 <span className="text-lg text-emerald-600">$CERN</span></span>
              <span className="text-[11px] font-black text-slate-900 bg-[#fef08a] border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] px-2.5 py-0.5 rounded-full flex items-center gap-0.5 uppercase">
                <TrendingUp size={12} strokeWidth={3} /> +12%
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-300 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] group-hover:bg-emerald-400 transition-colors">
            <Wallet size={24} className="text-slate-900" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Active Tasks - Minimal clean cards inspired by image 3 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Your Plan</h3>
            <span className="text-sm font-semibold text-emerald-600 cursor-pointer" onClick={() => navigate("/app/my-tasks")}>See all</span>
          </div>

          {activeTasks.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center bg-slate-50 rounded-[24px] border border-slate-100">
              <ClipboardList size={32} className="text-slate-300 mb-2" strokeWidth={1.5} />
              <span className="text-slate-500 text-sm font-medium">No active tasks right now.</span>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
              {activeTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/app/tasks/${task.id}`)}
                  className="min-w-[220px] max-w-[220px] rounded-[24px] p-5 flex flex-col justify-between h-44 cursor-pointer transition-all hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(209,250,229,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    boxShadow: "0 8px 32px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.9)" }}>
                        {task.status === "CLAIMED" ? "In Progress" : task.status}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {task.currency === "CERN" ? "" : "₹"}{task.rewardAmount}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.7)" }}>
                    <div className="flex items-center gap-2">
                      <img src={task.posterAvatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover shadow-sm" style={{ border: "1.5px solid rgba(255,255,255,0.9)" }} />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-medium">Poster</span>
                        <span className="text-xs text-slate-900 font-semibold">{task.posterName.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mini Leaderboard */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Performers</h3>
              <Trophy size={20} className="text-yellow-500" />
            </div>
            <span
              className="text-sm font-semibold text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors"
              onClick={() => navigate("/app/leaderboard")}
            >
              Full Rankings
            </span>
          </div>

          <div 
            onClick={() => navigate("/app/leaderboard")}
            className="flex flex-col gap-0 rounded-[24px] cursor-pointer group transition-all hover:-translate-y-0.5 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 24px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {[
              { rank: 1, name: "Sarah M.", score: "4,200 pts", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
              { rank: 2, name: "Alex R.", score: "3,850 pts", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
              { rank: 3, name: "David K.", score: "3,100 pts", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
            ].map((user, idx) => (
              <div key={user.rank} className={`flex items-center justify-between p-4 ${idx !== 2 ? 'border-b border-white/60' : ''} group-hover:bg-white/40 transition-colors`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-black shadow-sm ${user.rank === 1 ? 'bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 border border-yellow-300' : user.rank === 2 ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-800 border border-slate-300' : 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-900 border border-orange-300'}`}>
                    #{user.rank}
                  </div>
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover shadow-sm border-[1.5px] border-white/90" />
                  <span className="font-bold text-sm text-slate-800">{user.name}</span>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 shadow-sm">{user.score}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Campus Activity - Enhanced */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Activity</h3>
              <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-emerald-400 animate-pulse" />
            </div>
            <span
              className="text-sm font-semibold text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
              onClick={() => navigate("/app/notifications")}
            >
              View all
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.slice(0, 3).map((notif, i) => (
              <div
                key={notif.id}
                onClick={() => navigate("/app/notifications")}
                className="group flex gap-4 items-center p-4 rounded-[20px] transition-all cursor-pointer relative overflow-hidden hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                {/* Glass side accent on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[20px] bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-colors group-hover:bg-emerald-50" style={{ background: "rgba(248,250,252,0.8)", border: "1px solid rgba(255,255,255,0.9)" }}>
                  <Bell size={18} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="flex-1 pr-2">
                  <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors line-clamp-2">
                    {notif.text}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">{notif.time}</p>
                </div>
                <div className="shrink-0 text-slate-300 group-hover:text-emerald-500 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}