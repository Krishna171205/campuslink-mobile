import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ClipboardList } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function MyTasks() {
  const navigate = useNavigate();
  const { user, tasks } = useApp();

  const [activeTab, setActiveTab] = useState<"Active" | "Applied" | "Completed" | "Drafts" | "Flagged">("Active");

  const TABS = ["Active", "Applied", "Completed", "Drafts", "Flagged"];

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    const isPoster = task.posterName === user.name;
    const isHelper = task.helperName === user.name;
    const hasApplied = task.applicants.some(a => a.name === user.name);

    if (activeTab === "Active") {
      return (isPoster || isHelper) && (task.status === "CLAIMED" || task.status === "SUBMITTED");
    }
    if (activeTab === "Applied") {
      return hasApplied && task.status === "OPEN";
    }
    if (activeTab === "Completed") {
      return (isPoster || isHelper) && task.status === "COMPLETED";
    }
    if (activeTab === "Drafts") {
      return isPoster && task.status === "OPEN" && task.applicants.length === 0;
    }
    if (activeTab === "Flagged") {
      return (isPoster || isHelper) && task.status === "FLAGGED";
    }
    return false;
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative pb-32">
      <header className="px-6 pt-14 pb-4 sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl text-slate-900 tracking-tight flex items-center gap-2 uppercase font-black">
            My Tasks
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1.5 -mx-6 px-6">
          {TABS.map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${isActive
                  ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-350 hover:text-slate-950"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </header>

      <div className="p-6 space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[20px] p-10 text-center space-y-3">
            <ClipboardList size={32} className="mx-auto text-slate-300" strokeWidth={1.5} />
            <h4 className="font-extrabold text-slate-400 uppercase tracking-wider text-sm">No Tasks Found</h4>
          </div>
        ) : (
          filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/app/tasks/${task.id}`)}
              className="bg-white border-2 border-slate-900 p-4 rounded-[16px] shadow-[3px_3px_0px_rgba(15,23,42,1)] cursor-pointer flex flex-col gap-2 transition-transform active:scale-[0.98]"
            >
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${task.currency === "CERN"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-blue-50 border-blue-200 text-blue-600"
                  }`}>
                  {task.currency} Task
                </span>
                <span className="font-extrabold text-slate-900">
                  {task.currency === "CERN" ? "" : "₹"}{task.rewardAmount}{task.currency === "CERN" ? "cern" : ""}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase leading-snug">
                {task.title}
              </h3>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
