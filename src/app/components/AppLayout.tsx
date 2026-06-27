import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Briefcase, PlusCircle, MessageSquare, User, Settings, ShieldAlert, Coins, RefreshCw, X, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { id: "home", path: "/app/home", icon: Home, label: "Home" },
  { id: "tasks", path: "/app/tasks", icon: Briefcase, label: "Explore" },
  { id: "create", path: "/app/create", icon: PlusCircle, label: "Post" },
  { id: "messages", path: "/app/messages", icon: MessageSquare, label: "Chat" },
  { id: "profile", path: "/app/profile", icon: User, label: "Me" },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, bonusPopup, setBonusPopup } = useApp();

  const [showSimPanel, setShowSimPanel] = useState(false);

  const activeIndex = NAV_ITEMS.findIndex(item => location.pathname.startsWith(item.path));
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const cycleVerification = () => {
    const statuses = ["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"] as const;
    const currentIdx = statuses.indexOf(user.verificationStatus);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    setUser(prev => ({
      ...prev,
      verificationStatus: nextStatus,
      // Reset rolls or add defaults if moving to verified
      rollNumber: nextStatus !== "UNVERIFIED" ? (prev.rollNumber || "2K22/CO/89") : undefined,
      regNumber: nextStatus !== "UNVERIFIED" ? (prev.regNumber || "12023023") : undefined,
      idDocUrl: nextStatus !== "UNVERIFIED" ? (prev.idDocUrl || "id_card.png") : undefined,
    }));
  };

  const toggleRole = () => {
    const roles = ["user", "moderator", "admin"] as const;
    const currentIdx = roles.indexOf(user.role);
    const nextRole = roles[(currentIdx + 1) % roles.length];
    setUser(prev => ({ ...prev, role: nextRole }));
  };

  const addTokensSim = (amount: number) => {
    setUser(prev => ({ ...prev, cernBalance: Math.max(0, prev.cernBalance + amount) }));
  };

  const triggerBonusSim = (variant: "awarded" | "rejected") => {
    setBonusPopup({ show: true, variant });
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setBonusPopup(null);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-transparent relative overflow-hidden">

      {/* Simulation Controls Top Bar Toggle */}
      <div className="absolute top-1.5 left-4 right-4 z-50 flex flex-col items-center pointer-events-none">
        <button
          onClick={() => setShowSimPanel(!showSimPanel)}
          className="bg-slate-900 border border-slate-700 text-yellow-300 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 cursor-pointer pointer-events-auto hover:bg-slate-950 transition-colors"
        >
          <Settings size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>Simulation Controls</span>
        </button>

        <AnimatePresence>
          {showSimPanel && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm mt-2 bg-slate-900 border-2 border-slate-950 p-4 rounded-2xl shadow-xl space-y-3 pointer-events-auto text-white"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex items-center gap-1">
                  <ShieldAlert size={12} className="text-yellow-400" /> Simulator Panel
                </span>
                <button onClick={() => setShowSimPanel(false)} className="text-slate-450 hover:text-white cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[9px]">
                {/* Cycle verification */}
                <button
                  onClick={cycleVerification}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-2 font-black uppercase text-left flex justify-between items-center cursor-pointer hover:bg-slate-750"
                >
                  <div>
                    <p className="text-slate-400">Verify Status</p>
                    <p className="text-yellow-300 font-mono mt-0.5">{user.verificationStatus}</p>
                  </div>
                  <RefreshCw size={12} className="text-slate-500" />
                </button>

                {/* Cycle Role */}
                <button
                  onClick={toggleRole}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-2 font-black uppercase text-left flex justify-between items-center cursor-pointer hover:bg-slate-750"
                >
                  <div>
                    <p className="text-slate-400">User Role</p>
                    <p className="text-emerald-400 font-mono mt-0.5">{user.role.toUpperCase()}</p>
                  </div>
                  <RefreshCw size={12} className="text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[9px]">
                {/* Adjust Tokens */}
                <button
                  onClick={() => addTokensSim(50)}
                  className="bg-emerald-950/50 border border-emerald-900/50 hover:bg-emerald-900/50 rounded-xl py-1.5 font-bold uppercase cursor-pointer"
                >
                  +50 CERN
                </button>
                <button
                  onClick={() => addTokensSim(-50)}
                  className="bg-red-950/50 border border-red-900/50 hover:bg-red-900/50 rounded-xl py-1.5 font-bold uppercase cursor-pointer"
                >
                  -50 CERN
                </button>

                {/* Trigger Popup */}
                <button
                  onClick={() => triggerBonusSim("awarded")}
                  className="bg-slate-800 border border-slate-700 hover:bg-slate-750 rounded-xl py-1.5 font-bold uppercase cursor-pointer text-yellow-300 flex items-center justify-center gap-1"
                >
                  <Gift size={10} /> Bonus Popup
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Screen Outlet View */}
      <div className="flex-1 overflow-hidden relative z-10">
        <div className="h-full overflow-y-auto pb-32 no-scrollbar">
          <Outlet />
        </div>
      </div>

      {/* Re-designed Bottom Navigation Dock */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center h-[70px] pointer-events-auto max-w-sm w-full relative z-10"
        >
          {/* Sliding indicator cutout */}
          <motion.div
            className="magic-nav-indicator"
            animate={{ left: `calc(${safeActiveIndex * 20 + 10}% - 32px)` }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          />

          {NAV_ITEMS.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center w-[20%] h-[70px] relative z-20 cursor-pointer"
              >
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  {/* Active background bubble */}
                  {isActive && (
                    <motion.div
                      layoutId="active-ring"
                      className="absolute w-12 h-12 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}

                  <motion.div
                    animate={isActive ? { color: "#10B981" } : { color: "#0F172A" }}
                    transition={{ duration: 0.2 }}
                    className="relative z-20 flex items-center justify-center"
                  >
                    <Icon
                      size={22}
                      className="transition-colors duration-300"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.div>
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* CERN Bonus Popup overlay layout (emulated socket events) */}
      <AnimatePresence>
        {bonusPopup?.show && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-full max-w-xs bg-white border-2 border-slate-900 rounded-[28px] p-6 shadow-2xl text-center space-y-4 relative overflow-hidden"
            >
              {bonusPopup.variant === "awarded" ? (
                <>
                  <div className="text-4xl animate-bounce">🎉</div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">Bonus Awarded!</h3>
                  <div className="bg-emerald-50 border border-emerald-200/50 py-2 rounded-xl">
                    <span className="text-emerald-600 font-black text-xl">+2 $CERN</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold px-2 leading-relaxed">
                    You received a completion speed bonus for finishing the task efficiently!
                  </p>
                  <button
                    onClick={() => setBonusPopup(null)}
                    className="w-full btn-neo-glass py-2.5 text-[10px] font-black uppercase text-white cursor-pointer"
                  >
                    Got it!
                  </button>
                </>
              ) : (
                <>
                  <div className="text-4xl">⚠️</div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">Bonus Withheld</h3>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-semibold px-1">
                    You missed a +2 $CERN completion bonus because your account is unverified!
                  </p>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        setBonusPopup(null);
                        navigate("/app/verification");
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-650 text-white border border-emerald-600 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Verify Now
                    </button>
                    <button
                      onClick={() => setBonusPopup(null)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}