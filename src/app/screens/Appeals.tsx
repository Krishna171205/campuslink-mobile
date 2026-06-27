import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Gavel, AlertOctagon, HelpCircle, Check, Star } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function Appeals() {
  const navigate = useNavigate();
  const { user, tasks, appeals, submitAppeal } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Filter eligible tasks: status is FLAGGED or COMPLETED with rating 1 or 2 stars, and poster has rated it
  const lowRatedTasks = tasks.filter(t => 
    t.helperName === user.name && 
    (t.status === "FLAGGED" || (t.review && t.review.rating <= 2))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) {
      setError("Please select a task to appeal.");
      return;
    }
    if (!reason.trim()) {
      setError("Please explain your reason for the appeal.");
      return;
    }
    setError("");
    submitAppeal(selectedTaskId, reason);
    setReason("");
    setSelectedTaskId(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent relative overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-[#F8FAF8]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Appeals</h1>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Gavel size={32} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">Rating Appeals</h2>
          <p className="text-sm font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
            Did you receive an unfair rating? Submit an appeal detailing your case, and our admin moderators will audit your submission and rating.
          </p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl flex items-center gap-2">
            <Check className="text-emerald-600" size={18} />
            <span className="text-xs font-bold text-slate-800">Appeal submitted successfully to the admin queue!</span>
          </div>
        )}

        {/* Appeal Form */}
        <div className="neo-glass-card p-5 space-y-4 shadow-none">
          <h4 className="font-extrabold text-slate-900 text-sm uppercase">Submit new appeal</h4>
          
          {lowRatedTasks.length === 0 ? (
            <p className="text-xs font-semibold text-slate-500 bg-slate-50 p-4 border border-slate-200/50 rounded-xl">
              You don't have any recently completed tasks with a 1-2★ rating that are eligible for appeal.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-550 mb-1.5 uppercase tracking-widest">Select Task</label>
                <select
                  value={selectedTaskId || ""}
                  onChange={(e) => setSelectedTaskId(parseInt(e.target.value) || null)}
                  className="w-full input-neo-glass py-2.5 text-xs font-bold bg-white/60"
                  required
                >
                  <option value="">Select a task...</option>
                  {lowRatedTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.review?.rating}★)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-550 mb-1.5 uppercase tracking-widest">Reason for Appeal</label>
                <textarea
                  placeholder="Explain why this rating is unfair. Highlight your deliverables, timelines, or chat logs."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full input-neo-glass min-h-[100px] text-xs resize-none"
                  required
                />
              </div>

              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

              <button
                type="submit"
                className="w-full btn-neo-glass py-3 text-xs font-black uppercase tracking-wider cursor-pointer text-white"
              >
                Submit Appeal
              </button>
            </form>
          )}
        </div>

        {/* Appeals History */}
        <div className="space-y-3">
          <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest px-1">
            Appeal History
          </h4>

          {appeals.length === 0 ? (
            <div className="neo-glass-card p-6 text-center text-slate-400 font-semibold text-xs shadow-none">
              No appeals submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {appeals.map((appeal) => (
                <div key={appeal.id} className="neo-glass-card p-4 space-y-2.5 shadow-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs uppercase">{appeal.taskTitle}</h5>
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-red-500 uppercase">
                        <span>Original: {appeal.originalRating}</span>
                        <Star size={10} className="fill-red-500 stroke-red-650" />
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      appeal.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                      appeal.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-250" :
                      "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      {appeal.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-slate-50/50 p-2.5 rounded-lg border border-slate-150 font-medium leading-relaxed">
                    <strong>Appeal Note:</strong> "{appeal.reason}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
