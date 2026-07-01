import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Clock, MapPin, Share2, ShieldCheck, Users, Star, MessageSquare, AlertTriangle, CheckCircle, FileCheck, HelpCircle, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const taskId = parseInt(id || "");
  const { user, tasks, applyToTask, selectHelper, submitTaskWork, reviewTask } = useApp();

  const task = tasks.find(t => t.id === taskId);
  const [rejectedApplicants, setRejectedApplicants] = useState<string[]>([]);

  // Sheet states
  const [showApplySheet, setShowApplySheet] = useState(false);
  const [showSubmitSheet, setShowSubmitSheet] = useState(false);
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [showActiveRestrictionModal, setShowActiveRestrictionModal] = useState(false);

  // Submit form state
  const [submitComment, setSubmitComment] = useState("");
  const [submitFiles, setSubmitFiles] = useState<string[]>([]);
  const [submitLink, setSubmitLink] = useState("");

  // Review form state
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  if (!task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-white">
        <AlertTriangle size={32} className="text-red-500 mb-2" />
        <h3 className="font-bold text-slate-900">Task Not Found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 font-bold">Go Back</button>
      </div>
    );
  }

  const isPoster = task.posterName === user.name;
  const isHelper = task.helperName === user.name;
  const hasApplied = task.applicants.some(a => a.name === user.name);
  const canApply = !isPoster && !isHelper && !hasApplied;

  const hasActiveTask = tasks.some(t =>
    (t.helperName === user.name || t.posterName === user.name) &&
    (t.status === "CLAIMED" || t.status === "SUBMITTED" || t.status === "FLAGGED")
  );

  const handleApplyConfirm = () => {
    applyToTask(taskId);
    setShowApplySheet(false);
  };

  const handleWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitComment.trim()) return;
    submitTaskWork(taskId, submitComment, submitFiles.length > 0 ? submitFiles : ["deliverable_v2_mockup.fig"], submitLink);
    setShowSubmitSheet(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    reviewTask(taskId, rating, reviewComment);
    setShowReviewSheet(false);
  };

  const startChatSim = () => {
    navigate("/app/messages");
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative overflow-y-auto no-scrollbar pb-32 selection:bg-emerald-500 selection:text-white">
      <header className="px-6 pt-12 pb-4 bg-white/90 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex gap-2">
          {isPoster && task.status === "OPEN" && (
            <button
              onClick={() => navigate(`/app/tasks/${taskId}/edit`)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Edit2 size={18} strokeWidth={2.5} />
            </button>
          )}
          <button
            onClick={() => alert("Task link copied! Share with your classmates.")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Share2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8">

        {/* The "At-a-Glance" Hero Zone */}
        <div className="space-y-6">
          {/* Reward & Status */}
          <div className="flex items-end justify-between">
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 inline-block ${task.currency === "CERN" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                }`}>
                {task.currency} Reward
              </span>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mt-1">
                {task.currency === "CERN" ? "" : "₹"}{task.rewardAmount}
              </h1>
            </div>

            {/* 30% Brutalist Tag for Status */}
            <div className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transform -rotate-2 ${task.status === "OPEN" ? "bg-[#10b981] text-white" :
              task.status === "CLAIMED" ? "bg-yellow-400 text-slate-900" :
                task.status === "SUBMITTED" ? "bg-blue-400 text-white" :
                  task.status === "COMPLETED" ? "bg-slate-200 text-slate-800" :
                    task.status === "FLAGGED" ? "bg-red-500 text-white" :
                      "bg-white text-slate-900"
              }`}>
              {task.status}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 leading-tight">
            {task.title}
          </h2>

          {/* Meta Horizontal Row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <Clock size={16} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-600">{task.deadline}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <MapPin size={16} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-600">{task.location}</span>
            </div>
          </div>
        </div>

        {/* The Poster / Client Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-[28px] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={task.posterAvatar}
                alt={task.posterName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Posted By</p>
              <h4 className="font-bold text-slate-900 text-base leading-none mb-1">
                {task.posterName}
              </h4>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-500" />
                4.9 • {task.posterCollege || "DTU"}
              </p>
            </div>
          </div>

          {!isPoster && (
            <button
              onClick={startChatSim}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Message
            </button>
          )}
        </div>

        {/* Core Task Information */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Task Description
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap pl-3.5">
              {task.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2 pl-3.5">
              {task.skillsRequired.map(skill => (
                <span key={skill} className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Applicants List (Poster View) */}
        {isPoster && task.status === "OPEN" && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Applicants ({task.applicants.length})
            </h3>

            {task.applicants.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-[24px] py-8 text-center px-6">
                <Users size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">
                  Your task is live! We'll notify you when classmates apply.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pl-3.5">
                {task.applicants.filter(app => !rejectedApplicants.includes(app.name)).length === 0 ? (
                  <p className="text-sm font-medium text-slate-500 bg-slate-50 py-6 rounded-[24px] text-center border border-slate-100">
                    All applicants declined.
                  </p>
                ) : (
                  task.applicants.filter(app => !rejectedApplicants.includes(app.name)).map((app, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-[24px] flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <img src={app.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" alt={app.name} />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{app.name}</h4>
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
                            <Star size={12} className="fill-yellow-400 text-yellow-500" />
                            <span>{app.rating} Rating</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRejectedApplicants(prev => [...prev, app.name])}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          ✕
                        </button>
                        <button
                          onClick={() => selectHelper(taskId, app.name)}
                          className="bg-emerald-500 text-white border-t border-slate-200/50 hover:bg-emerald-600 px-5 py-2.5 rounded-full text-xs font-bold shadow-sm transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Deliverables details (Once submitted) */}
        {task.submission && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Submitted Work
            </h3>
            <div className="bg-emerald-50 rounded-[28px] p-6 space-y-4 border border-emerald-100 ml-3.5">
              <p className="text-sm font-medium text-emerald-900 leading-relaxed italic">"{task.submission.comment}"</p>

              <div className="pt-4 border-t border-emerald-200/50 space-y-2 text-xs font-medium text-emerald-800">
                <p className="flex items-center gap-2">
                  <FileCheck size={16} />
                  Files: <strong className="font-bold">{task.submission.files.join(", ")}</strong>
                </p>
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

        {/* Rating feedback display (Once completed) */}
        {task.review && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm text-slate-900 font-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
              Review Feedback
            </h3>
            <div className="bg-slate-50 border border-slate-100 rounded-[28px] p-6 space-y-3 ml-3.5">
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
              {task.review.flagged && (
                <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-2 mt-4">
                  <AlertTriangle size={18} />
                  <span>Held in Admin Queue for Dispute resolution</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* The "Conversion" Zone: 30% Neo-Brutalism */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        {canApply && (
          <button
            onClick={() => {
              if (hasActiveTask) {
                setShowActiveRestrictionModal(true);
              } else {
                setShowApplySheet(true);
              }
            }}
            className="w-full btn-neo-glass py-4 flex items-center justify-center gap-3 cursor-pointer text-white font-bold "
          >
            Apply for Task
          </button>
        )}

        {hasApplied && task.status === "OPEN" && (
          <button
            disabled
            className="w-full bg-slate-100 border-2 border-slate-200 text-slate-400 py-4 text-base font-black uppercase tracking-wider cursor-not-allowed"
          >
            Application Sent
          </button>
        )}

        {isHelper && task.status === "CLAIMED" && (
          <button
            onClick={() => navigate(`/app/tasks/${taskId}/complete`)}
            className="w-full bg-[#10b981] border-2 border-slate-900 py-4 shadow-[5px_5px_0px_0px_#0f172a] text-white text-base font-black uppercase tracking-wider active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_#0f172a] transition-all"
          >
            Submit Work
          </button>
        )}

        {isHelper && task.status === "SUBMITTED" && (
          <button
            disabled
            className="w-full bg-slate-100 border-2 border-slate-200 text-slate-400 py-4 text-base font-black uppercase tracking-wider cursor-not-allowed animate-pulse"
          >
            Awaiting Review
          </button>
        )}

        {isPoster && task.status === "SUBMITTED" && (
          <button
            onClick={() => setShowReviewSheet(true)}
            className="w-full bg-[#10b981] border-2 border-slate-900 py-4 shadow-[5px_5px_0px_0px_#0f172a] text-white text-base font-black uppercase tracking-wider active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_#0f172a] transition-all"
          >
            Review Helper
          </button>
        )}

        {task.status === "COMPLETED" && (
          <button
            disabled
            className="w-full bg-emerald-50 border-2 border-emerald-100 text-emerald-600 py-4 text-base font-black uppercase tracking-wider cursor-not-allowed"
          >
            Completed ✓
          </button>
        )}

        {task.status === "FLAGGED" && (
          <div className="text-center space-y-2">
            <button
              disabled
              className="w-full bg-red-50 border-2 border-red-200 text-red-500 py-4 text-base font-black uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
            >
              <AlertTriangle size={18} /> Locked & Disputed
            </button>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Payments held pending admin audit</p>
          </div>
        )}
      </div>

      {/* Confirmation bottom sheets & modals overlays - Clean styling */}
      <AnimatePresence>
        {/* Apply Sheet */}
        {showApplySheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplySheet(false)}
              className="absolute inset-0 bg-slate-900 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 p-6 space-y-6 pb-10"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Apply to Task</h3>
                <p className="text-sm text-slate-500 px-4 leading-relaxed font-medium">
                  Classmates can view your credentials, ratings, and stats when you apply.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowApplySheet(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 text-sm font-bold rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyConfirm}
                  className="flex-1 bg-[#10b981] hover:bg-emerald-500 text-white py-4 text-sm font-bold rounded-2xl shadow-sm transition-colors"
                >
                  Confirm Application
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Submit Work Sheet */}
        {showSubmitSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitSheet(false)}
              className="absolute inset-0 bg-slate-900 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 p-6 space-y-5 pb-10"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Log Deliverables</h3>
              </div>

              <form onSubmit={handleWorkSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Comments</label>
                  <textarea
                    placeholder="Describe what tasks were done..."
                    value={submitComment}
                    onChange={(e) => setSubmitComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">External Links (Optional)</label>
                  <input
                    type="url"
                    placeholder="Google Drive link or repo..."
                    value={submitLink}
                    onChange={(e) => setSubmitLink(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Files (Optional)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer relative hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSubmitFiles(prev => [...prev, e.target.files![0].name]);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileCheck size={28} className="text-emerald-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700">Tap to upload deliverables</p>
                  </div>

                  {submitFiles.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {submitFiles.map(file => (
                        <div key={file} className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                          <p className="text-xs font-bold text-slate-700 truncate">{file}</p>
                          <button
                            type="button"
                            onClick={() => setSubmitFiles(prev => prev.filter(f => f !== file))}
                            className="text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmitSheet(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 text-sm font-bold rounded-2xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#10b981] hover:bg-emerald-500 text-white py-4 text-sm font-bold rounded-2xl shadow-sm transition-colors"
                  >
                    Submit Work
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* Review Sheet */}
        {showReviewSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewSheet(false)}
              className="absolute inset-0 bg-slate-900 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 p-6 space-y-5 pb-10"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Review Helper</h3>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating stars picker */}
                <div className="flex justify-center gap-3 py-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer transition-transform duration-150 active:scale-90"
                    >
                      <Star
                        size={44}
                        className={star <= rating ? "fill-yellow-400 text-yellow-500" : "text-slate-200"}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating labels */}
                {rating > 0 && (
                  <p className="text-center font-bold text-sm text-slate-500 leading-none">
                    {rating === 1 ? "Terrible" :
                      rating === 2 ? "Poor" :
                        rating === 3 ? "Average" :
                          rating === 4 ? "Good" :
                            "Excellent"}
                  </p>
                )}

                {/* Low Rating Warning Banner */}
                {rating > 0 && rating <= 2 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl text-xs font-medium text-yellow-800 flex gap-3 items-start">
                    <AlertTriangle size={20} className="shrink-0 text-yellow-600 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="block mb-1 font-bold">Low Rating Warning</strong>
                      Selecting 1 or 2 stars will automatically lock the payment and report the task for administrator audit review.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Review Comments</label>
                  <textarea
                    placeholder="Provide detailed feedback on code quality, design fidelity, or tutor help..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[100px]"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewSheet(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 text-sm font-bold rounded-2xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rating === 0}
                    className={`flex-1 py-4 text-sm font-bold rounded-2xl transition-all ${rating === 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : rating <= 2
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-[#10b981] hover:bg-emerald-500 text-white shadow-md"
                      }`}
                  >
                    {rating === 0 ? "Select Rating" : rating <= 2 ? "Submit & Flag" : "Submit & Release"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* Active Task Restriction Modal */}
        {showActiveRestrictionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActiveRestrictionModal(false)}
              className="absolute inset-0 bg-slate-900 z-[110]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-sm bg-white rounded-[32px] shadow-2xl z-[120] p-8 space-y-6 overflow-hidden text-center"
            >
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <AlertTriangle size={36} strokeWidth={2} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-slate-900">One Task at a Time</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  You already have an active task. Please complete or resolve your current task before applying to a new one.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowActiveRestrictionModal(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 text-sm font-bold rounded-2xl transition-all"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
