import { useNavigate } from "react-router";
import { ArrowLeft, Bell, Lock, Shield, CircleHelp, LogOut, ChevronRight, Moon } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function Settings() {
  const navigate = useNavigate();
  const { user } = useApp();

  const handleLogout = () => {
    // Basic mock logout flow
    navigate("/login");
  };

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: <Lock size={18} />, label: "Privacy & Security", action: () => {} },
        { icon: <Shield size={18} />, label: "Verification Status", action: () => navigate("/app/verification") },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: <Bell size={18} />, label: "Notifications", action: () => navigate("/app/notifications") },
        { icon: <Moon size={18} />, label: "Dark Mode", value: "Off", action: () => {} },
      ]
    },
    {
      title: "Support & About",
      items: [
        { icon: <CircleHelp size={18} />, label: "Help Center & FAQ", action: () => {} },
        { icon: <Shield size={18} />, label: "Terms of Service", action: () => {} },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 absolute inset-0 z-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/80 border-b border-slate-200/50 shadow-sm backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 cursor-pointer text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
        {/* User Profile Summary */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-full border-2 border-emerald-500 p-0.5 shrink-0">
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-900 text-lg leading-tight">{user.name}</h2>
            <p className="text-sm font-medium text-slate-500">{user.email}</p>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{group.title}</h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {group.items.map((item, itemIdx) => (
                  <motion.button
                    whileTap={{ backgroundColor: "rgba(248, 250, 248, 1)" }}
                    key={itemIdx}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer ${
                      itemIdx < group.items.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-xs font-bold text-slate-400">{item.value}</span>
                      )}
                      <ChevronRight size={16} strokeWidth={2.5} className="text-slate-300" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 font-bold shadow-sm cursor-pointer hover:bg-rose-100 transition-colors mt-8"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Log Out</span>
        </motion.button>
        
        <div className="text-center mt-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CampusLink v2.0.0</p>
        </div>
      </div>
    </div>
  );
}
