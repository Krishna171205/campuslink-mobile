import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, UploadCloud, Link as LinkIcon, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";

export function TaskCompletion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, submitTaskWork } = useApp();

  const task = tasks.find(t => t.id === Number(id));

  const [comment, setComment] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <h3 className="font-extrabold text-slate-900 uppercase">Task Not Found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 font-extrabold">Go Back</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    // Simulate slight network delay for better UX feel
    setTimeout(() => {
      submitTaskWork(task.id, comment, ["deliverable_v1_final.zip"], link);
      setIsSubmitting(false);
      navigate(-1);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent relative overflow-y-auto pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/50 bg-[#F8FAF8]/90 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 cursor-pointer transition-all shadow-sm"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Task Actions</p>
          <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Submit Work</h2>
        </div>
        <div className="w-10" />
      </header>

      <div className="p-6 space-y-8">

        {/* Task Context Card */}
        <div className="bg-white border-2 border-slate-900 rounded-[20px] p-5 space-y-3 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/50">
                In Progress
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-2 leading-snug">{task.title}</h3>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
              <span className="font-extrabold text-slate-800 text-xs">
                {task.currency === "CERN" ? "" : "₹"}{task.rewardAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Log Deliverables</h2>
            <p className="text-xs font-semibold text-slate-500">
              Provide a clear summary of your work and attach relevant links so the poster can review and release payment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <FileText size={14} className="text-slate-400" />
                Work Summary *
              </label>
              <textarea
                required
                placeholder="E.g., I've completed the UI mockups and fixed the alignment issues as requested..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-[16px] p-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none min-h-[120px] shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <LinkIcon size={14} className="text-slate-400" />
                External Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://figma.com/file/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-[16px] px-4 py-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-[16px] p-5 flex flex-col items-center justify-center text-center gap-2 border-dashed relative overflow-hidden group cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                <UploadCloud size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Upload Source Files</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">ZIP, PDF, or Images up to 50MB</p>
              </div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

          </form>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-200/50 z-30 pb-8 md:pb-6">
        <button
          onClick={handleSubmit}
          disabled={!comment.trim() || isSubmitting}
          className={`w-full py-4 text-sm font-bold text-white uppercase tracking-wider rounded-[18px] flex items-center justify-center gap-2 transition-all ${!comment.trim() || isSubmitting
            ? "bg-slate-200 text-slate-400 border-2 border-slate-300 shadow-none cursor-not-allowed"
            : "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] active:translate-y-0 active:shadow-none cursor-pointer"
            }`}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              <CheckCircle2 size={18} strokeWidth={1.5} />
              Submit Work for Review
            </>
          )}
        </button>
      </div>

    </div>
  );
}
