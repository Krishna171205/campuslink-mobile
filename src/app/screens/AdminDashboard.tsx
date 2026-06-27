import { useNavigate } from "react-router";
import { ArrowLeft, ShieldAlert, CheckCircle2, XCircle, Search, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const mockAppeals = [
  { id: "APP-104", user: "Raj K.", task: "UI Design Kit", status: "pending", date: "2h ago" },
  { id: "APP-103", user: "Simran M.", task: "Physics Notes", status: "resolved", date: "1d ago" },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"appeals" | "verifications">("appeals");

  return (
    <div className="flex flex-col h-full bg-slate-50/50 absolute inset-0 z-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-slate-900 shadow-sm flex items-center justify-between sticky top-0 z-10 text-white">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 cursor-pointer text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Admin Console</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Moderator Access</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-4 gap-2 bg-white border-b border-slate-200">
        <button 
          onClick={() => setActiveTab("appeals")}
          className={`flex-1 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
            activeTab === "appeals" 
              ? "bg-[#10b981] text-slate-900 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" 
              : "bg-slate-100 text-slate-600 border-slate-100 hover:bg-slate-200"
          }`}
        >
          Active Appeals
        </button>
        <button 
          onClick={() => setActiveTab("verifications")}
          className={`flex-1 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
            activeTab === "verifications" 
              ? "bg-[#10b981] text-slate-900 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" 
              : "bg-slate-100 text-slate-600 border-slate-100 hover:bg-slate-200"
          }`}
        >
          Verifications
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center p-1 pl-3">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 bg-transparent py-2 px-2 text-xs font-bold outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <Filter size={16} />
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {mockAppeals.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className={item.status === "pending" ? "text-rose-500" : "text-emerald-500"} />
                  <span className="text-xs font-black font-mono text-slate-500">{item.id}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                  item.status === "pending" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                }`}>
                  {item.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-sm">{item.task}</h3>
                <p className="text-xs font-medium text-slate-500">Reported by {item.user} • {item.date}</p>
              </div>

              {item.status === "pending" && (
                <div className="flex gap-2">
                  <button className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                    <CheckCircle2 size={14} /> Resolve Favor
                  </button>
                  <button className="flex-1 bg-rose-50 text-rose-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-rose-200 hover:bg-rose-100 transition-colors">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
