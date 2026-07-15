import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Star, AlertTriangle, FileCheck, Share2, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export function TaskCompleted() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks } = useApp();

  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <h3 className="font-extrabold text-slate-900 uppercase">Task Not Found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 font-extrabold">Go Back</button>
      </div>
    );
  }

  const isFlagged = task.status === "FLAGGED";

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
          <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Task Status</p>
          <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Task Details</h2>
        </div>
        <div className="w-10" />
      </header>

      <div className="p-6 space-y-8">
        
        {/* Banner */}
        {isFlagged ? (
          <div className="bg-red-50 border-2 border-red-500 rounded-[20px] p-5 shadow-[4px_4px_0px_0px_#ef4444] text-red-900 flex flex-col items-center text-center">
            <AlertTriangle size={32} className="mb-3 text-red-500" />
            <h2 className="font-black text-xl uppercase tracking-tight mb-1">Disputed Task</h2>
            <p className="text-sm font-medium opacity-80">This task was flagged during review. Admin audit in progress.</p>
          </div>
        ) : (
          <div className="bg-[#10b981] border-2 border-slate-900 rounded-[20px] p-5 shadow-[4px_4px_0px_0px_#0f172a] text-slate-900 flex flex-col items-center text-center">
            <CheckCircle2 size={32} strokeWidth={3} className="mb-3" />
            <h2 className="font-black text-xl uppercase tracking-tight mb-1">Task Completed</h2>
            <p className="text-sm font-bold opacity-90">Work accepted and payments released.</p>
          </div>
        )}
        
        {/* Task Context Card */}
        <div className="bg-white border-2 border-slate-900 rounded-[20px] p-5 space-y-3 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/50">
                {task.category}
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

        {/* Deliverables details */}
        {task.submission && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Submitted Work
            </h3>
            <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm space-y-4">
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{task.submission.comment}"</p>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
                {task.submission.files && task.submission.files.length > 0 && (
                  <p className="flex items-center gap-2">
                    <FileCheck size={16} />
                    Files: <strong className="font-bold text-slate-800">{task.submission.files.join(", ")}</strong>
                  </p>
                )}
                {task.submission.link && (
                  <p className="flex items-center gap-2">
                    <Share2 size={16} />
                    Link: <a href={task.submission.link} target="_blank" rel="noreferrer" className="font-bold text-emerald-600 underline">{task.submission.link}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Feedback */}
        {task.review && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Review Feedback
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-[28px] p-6 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < (task.review?.rating || 0) ? "fill-yellow-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-400">{task.review.reviewedAt}</span>
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                "{task.review.comment || 'Helper did an excellent job!'}"
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
