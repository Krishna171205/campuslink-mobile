import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, AlertTriangle, FileCheck, Share2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";

// Simple linear interpolation
const interpolate = (val: number, inRange: number[], outRange: number[]) => {
  if (val <= inRange[0]) return outRange[0];
  if (val >= inRange[inRange.length - 1]) return outRange[outRange.length - 1];
  let i = 1;
  while (val > inRange[i]) i++;
  const p1 = inRange[i - 1];
  const p2 = inRange[i];
  const percentage = (val - p1) / (p2 - p1);
  return outRange[i - 1] + percentage * (outRange[i] - outRange[i - 1]);
};

// Color interpolation for smooth background transitions using HSL for vibrant intermediate colors
const interpolateColor = (val: number) => {
  // Red (BAD): hsl(0, 84%, 60%) roughly #ef4444
  // Dark Yellow (AVERAGE): hsl(45, 93%, 47%) roughly #eab308
  // App Green (EXCELLENT): hsl(160, 84%, 39%) roughly #10b981
  const h = Math.round(interpolate(val, [1, 3, 5], [0, 45, 160]));
  const s = Math.round(interpolate(val, [1, 3, 5], [84, 93, 84]));
  const l = Math.round(interpolate(val, [1, 3, 5], [60, 47, 39]));
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export function TaskReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, reviewTask } = useApp();

  const task = tasks.find(t => t.id === Number(id));

  const [rating, setRating] = useState(4); // Default to 4 (GOOD)
  const [reviewComment, setReviewComment] = useState("");

  const getMouthPath = (r: number) => {
    const cy = interpolate(r, [1, 2, 3, 4, 5], [110, 130, 140, 160, 185]);
    const y = interpolate(r, [1, 2, 3, 4, 5], [150, 145, 140, 135, 125]);
    return `M 60 ${y} Q 100 ${cy} 140 ${y}`;
  };

  const getLabel = (r: number) => {
    if (r < 1.5) return "BAD";
    if (r < 2.5) return "POOR";
    if (r < 3.5) return "AVERAGE";
    if (r < 4.5) return "GOOD";
    return "EXCELLENT";
  };

  if (!task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <h3 className="font-extrabold text-slate-900 uppercase">Task Not Found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 font-extrabold">Go Back</button>
      </div>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    reviewTask(task.id, Math.round(rating), reviewComment);
    navigate(`/app/tasks/${task.id}/completed`, { replace: true });
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
          <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Review Helper</h2>
        </div>
        <div className="w-10" />
      </header>

      <div className="p-6 space-y-8">

        {/* Task Context Card */}
        <div className="bg-white border-2 border-slate-900 rounded-[20px] p-5 space-y-3 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/50">
                Awaiting Review
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

        {/* Deliverables details (Once submitted) */}
        {task.submission && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Submitted Work
            </h3>
            <div className="bg-emerald-50 rounded-[28px] p-6 space-y-4 border border-emerald-100">
              <p className="text-sm font-medium text-emerald-900 leading-relaxed italic">"{task.submission.comment}"</p>

              <div className="pt-4 border-t border-emerald-200/50 space-y-2 text-xs font-medium text-emerald-800">
                {task.submission.files && task.submission.files.length > 0 && (
                  <p className="flex items-center gap-2">
                    <FileCheck size={16} />
                    Files: <strong className="font-bold">{task.submission.files.join(", ")}</strong>
                  </p>
                )}
                {task.submission.link && (
                  <p className="flex items-center gap-2">
                    <Share2 size={16} />
                    Link: <a href={task.submission.link} target="_blank" rel="noreferrer" className="font-bold underline">{task.submission.link}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <form onSubmit={handleReviewSubmit} className="space-y-6">

            {/* Animated Face & Slider Section */}
            <motion.div 
              className="rounded-[32px] p-6 pb-8 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex flex-col items-center transition-colors duration-150"
              style={{ backgroundColor: interpolateColor(rating) }}
            >
              <h3 className="font-bold text-white text-center mb-6">How was your helper's work?</h3>

              {/* Face SVG */}
              <div className="w-48 h-48 relative mb-2">
                <svg viewBox="0 0 200 200" className="w-full h-full text-white drop-shadow-sm">
                  {/* Left Eye */}
                  <circle cx="60" cy="80" r={interpolate(rating, [1, 3, 5], [25, 30, 35])} fill="currentColor" />
                  {/* Right Eye */}
                  <circle cx="140" cy="80" r={interpolate(rating, [1, 3, 5], [25, 30, 35])} fill="currentColor" />
                  {/* Animated Mouth */}
                  <motion.path
                    d={getMouthPath(rating)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Dynamic Label */}
              <h2 className="text-4xl font-black text-white tracking-tighter mb-8 transition-all">
                {getLabel(rating)}
              </h2>

              {/* Smooth Slider */}
              <div className="w-full px-2">
                <div className="relative w-full h-12 flex flex-col justify-center group">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.01"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="w-full appearance-none bg-transparent cursor-pointer relative z-20 h-full focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_4px_10px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-90"
                  />
                  {/* Custom Track */}
                  <div className="absolute left-0 right-0 h-1.5 bg-white/30 rounded-full top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                  {/* Tick Marks (approximate visual locations) */}
                  <div className="absolute left-0 right-0 flex justify-between top-1/2 -translate-y-1/2 z-10 px-1 pointer-events-none">
                    {[1, 2, 3, 4, 5].map(step => (
                      <div key={step} className="w-2.5 h-2.5 rounded-full bg-white opacity-40" />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-white/80 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">
                  <span>Bad</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            </motion.div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Review Comments
              </label>
              <textarea
                placeholder="Provide detailed feedback on code quality, design fidelity, or tutor help..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-[16px] p-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none min-h-[120px] shadow-sm"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-200/50 z-30 pb-8 md:pb-6">
        <button
          onClick={handleReviewSubmit}
          disabled={rating === 0}
          className={`w-full py-4 text-sm font-bold text-white uppercase tracking-wider rounded-[18px] flex items-center justify-center gap-2 transition-all ${rating === 0
            ? "bg-slate-200 text-slate-400 border-2 border-slate-300 shadow-none cursor-not-allowed"
            : rating <= 2
              ? "bg-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] active:translate-y-0 active:shadow-none cursor-pointer text-white"
              : "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] active:translate-y-0 active:shadow-none cursor-pointer"
            }`}
        >
          {rating === 0 ? "Select Rating" : rating <= 2 ? "Submit & Flag" : "Submit & Release"}
        </button>
      </div>

    </div>
  );
}
