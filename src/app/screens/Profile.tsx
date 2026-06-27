import { 
  Settings as SettingsIcon, MapPin, Award, ClipboardList, Wallet, 
  UserCheck, History, Gift, Users, Bell, Trophy, BookOpen, 
  ShieldAlert, LogOut, ArrowRight, ShieldCheck, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { CernIcon } from "../components/ui/CernIcon";

export function Profile() {
  const navigate = useNavigate();
  const { user, setUser, tasks } = useApp();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      // Reset profile completion to show onboarding flow on reload
      setUser(prev => ({ ...prev, hasCompletedProfile: false }));
      navigate("/login");
    }
  };

  // Compute counts
  const postedCount = tasks.filter(t => t.posterName === user.name).length;
  const helperCount = tasks.filter(t => t.helperName === user.name).length;

  return (
    <div className="flex flex-col min-h-full bg-transparent relative overflow-y-auto no-scrollbar pb-32">
      {/* Cover Photo Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[200px] z-0 overflow-hidden border-b border-slate-200/50">
        <div className="absolute inset-0 bg-slate-900/10 z-10 mix-blend-overlay" />
        <img
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80"
          alt="Cover"
          className="w-full h-full object-cover blur-[0.5px]"
        />
      </div>

      <header className="px-6 pt-12 pb-4 sticky top-0 z-30 flex items-center justify-between">
        <h1 className="text-lg font-black text-white drop-shadow uppercase tracking-widest">My Profile</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/app/settings")}
          className="w-10 h-10 flex items-center justify-center rounded-xl btn-neo-glass-secondary bg-white/70 backdrop-blur-md cursor-pointer text-slate-900 border border-slate-250/30"
        >
          <SettingsIcon size={18} strokeWidth={2.5} />
        </motion.button>
      </header>

      <div className="z-10 relative px-6 mt-12 space-y-6">
        {/* Main Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-glass-card-important p-6 relative overflow-hidden bg-white/95"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-900 relative z-10 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg border border-emerald-600/30 uppercase tracking-wider z-20">
                  LV.4
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                user.verificationStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-250" :
                user.verificationStatus === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-250" :
                user.verificationStatus === "REJECTED" ? "bg-red-50 text-red-650 border-red-200" :
                "bg-slate-50 text-slate-400 border-slate-250"
              }`}>
                {user.verificationStatus}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase flex items-center gap-1.5">
                {user.name}
                {user.verificationStatus === "VERIFIED" && (
                  <ShieldCheck size={18} className="text-emerald-500 fill-emerald-100" />
                )}
              </h2>
              <p className="text-xs font-bold text-slate-450 flex items-center gap-1 uppercase">
                <MapPin size={14} className="text-emerald-500 shrink-0" /> {user.college} • {user.major}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {user.skills.map(skill => (
                <span key={skill} className="text-slate-800 text-[8px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg neo-glass-pill">
                  {skill}
                </span>
              ))}
            </div>

            <p className="text-slate-700 text-xs leading-relaxed font-semibold border-t border-slate-200/60 pt-4">
              {user.bio}
            </p>
          </div>
        </motion.div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="neo-glass-card p-3 text-center shadow-none">
            <span className="text-emerald-600 font-black text-base flex items-center justify-center gap-1">
              <CernIcon size={14} /> {user.cernBalance}
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1">CERN Balance</span>
          </div>
          <div className="neo-glass-card p-3 text-center shadow-none">
            <span className="text-slate-900 font-black text-base block">{user.tasksCompletedCount}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1">Tasks Done</span>
          </div>
          <div className="neo-glass-card p-3 text-center shadow-none">
            <span className="text-slate-900 font-black text-base block">⭐ 4.8</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1">Rep Star</span>
          </div>
        </div>

        {/* Grouped iOS Settings Style Menu */}
        <div className="space-y-5">
          {/* Account Group */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-slate-450 uppercase tracking-widest px-1">Account Operations</h4>
            <div className="bg-white/60 border border-slate-200/50 rounded-2xl overflow-hidden divide-y divide-slate-100">
              <div 
                onClick={() => navigate("/app/my-tasks")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <ClipboardList size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">Posted & Claimed Tasks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-md border">{postedCount + helperCount}</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>

              <div 
                onClick={() => navigate("/app/wallet")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <Wallet size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">My Wallets & Ledger</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </div>

              <div 
                onClick={() => navigate("/app/verification")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <UserCheck size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">College Verification</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </div>

              <div 
                onClick={() => navigate("/app/appeals")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <ShieldCheck size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">Rating Appeals Logs</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </div>

              <div 
                onClick={() => navigate("/app/referral")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <Users size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">Referral / Invite Peers</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>
          </div>

          {/* Activity Group */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-slate-450 uppercase tracking-widest px-1">Campus Hub Activity</h4>
            <div className="bg-white/60 border border-slate-200/50 rounded-2xl overflow-hidden divide-y divide-slate-100">
              <div 
                onClick={() => navigate("/app/notifications")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <Bell size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">Notifications logs</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </div>

              <div 
                onClick={() => navigate("/app/leaderboard")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <Trophy size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">Reputation Leaderboards</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </div>

              <div 
                onClick={() => navigate("/app/rewards")}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3 text-slate-800">
                  <Gift size={16} className="text-slate-500" />
                  <span className="text-xs font-extrabold uppercase">Rewards Marketplace</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>
          </div>

          {/* Admin Group (Conditional) */}
          {(user.role === "admin" || user.role === "moderator") && (
            <div className="space-y-2">
              <h4 className="text-[9px] font-black text-red-500 uppercase tracking-widest px-1">Authority Dashboard</h4>
              <div className="bg-white/60 border border-red-200/40 rounded-2xl overflow-hidden divide-y divide-red-100/30">
                <div 
                  onClick={() => navigate("/app/admin")}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center gap-3 text-slate-800">
                    <ShieldAlert size={16} className="text-red-500" />
                    <span className="text-xs font-extrabold uppercase">
                      {user.role === "admin" ? "Admin Command Dashboard" : "Mod College Queue"}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-red-400" />
                </div>
              </div>
            </div>
          )}

          {/* Logout Group */}
          <div className="space-y-2">
            <div className="bg-white/60 border border-slate-200/50 rounded-2xl overflow-hidden">
              <div 
                onClick={handleLogout}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-red-600">
                  <LogOut size={16} />
                  <span className="text-xs font-extrabold uppercase">Logout Account</span>
                </div>
                <ChevronRight size={14} className="text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
