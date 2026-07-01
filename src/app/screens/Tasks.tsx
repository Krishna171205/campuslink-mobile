import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, Clock, MapPin, ChevronRight, Zap, FilterX, HelpCircle, Bookmark, Flag, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

export function Tasks() {
  const navigate = useNavigate();
  const { user, tasks } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currencyFilter, setCurrencyFilter] = useState<"ALL" | "CERN" | "INR">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "deadline">("newest");
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [bookmarkedTasks, setBookmarkedTasks] = useState<number[]>([]);
  const [flaggedTasks, setFlaggedTasks] = useState<number[]>([]);
  const [reportingTask, setReportingTask] = useState<typeof tasks[0] | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarkedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleFlag = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFlaggedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const CATEGORIES = ["All", "Design", "Development", "Writing", "Research", "Tutoring"];

  // Filter tasks based on query, category, and currency
  const filteredTasks = tasks.filter(task => {
    // Only show OPEN tasks in general feed (or tasks they are already associated with, but standard feed is open opportunities)
    if (task.status !== "OPEN") return false;

    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === "All" || task.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesCurrency = currencyFilter === "ALL" || task.currency === currencyFilter;

    return matchesSearch && matchesCategory && matchesCurrency;
  });

  // Prioritize same college, then sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Priority: Same college first
    const aSameCollege = a.posterCollege === user.college;
    const bSameCollege = b.posterCollege === user.college;
    if (aSameCollege && !bSameCollege) return -1;
    if (!aSameCollege && bSameCollege) return 1;

    // Standard sorting
    if (sortBy === "highest") {
      // Compare rewards. Since CERN and INR have different valuations, we sort within their values
      return b.rewardAmount - a.rewardAmount;
    } else if (sortBy === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else {
      // Default: newest (higher id first in prototype)
      return b.id - a.id;
    }
  });

  return (
    <div className="flex flex-col min-h-full bg-transparent relative">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 sticky top-0 z-30 bg-[#F8FAF8]/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl text-slate-900 tracking-tight flex items-center gap-2.5 uppercase font-black">
            Explore Feed
          </h1>
          <div className="flex items-center gap-3">

            {/* Currency Pill Toggle */}
            <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 shadow-inner max-w-[140px]">
              <button
                onClick={() => setCurrencyFilter("ALL")}
                className={`px-3 py-2 text-[9px] font-black uppercase rounded-lg transition-all tracking-wider ${currencyFilter === "ALL" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500"}`}
              >All</button>
              <button
                onClick={() => setCurrencyFilter("CERN")}
                className={`px-3 py-2 text-[9px] font-black uppercase rounded-lg transition-all tracking-wider ${currencyFilter === "CERN" ? "bg-emerald-400 text-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] border-2 border-slate-900" : "text-slate-500"}`}
              >CERN</button>
              <button
                onClick={() => setCurrencyFilter("INR")}
                className={`px-3 py-2 text-[9px] font-black uppercase rounded-lg transition-all tracking-wider ${currencyFilter === "INR" ? "bg-blue-400 text-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] border-2 border-slate-900" : "text-slate-500"}`}
              >INR</button>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 z-10">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search titles, descriptions, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 h-12 text-xs font-semibold text-slate-900 outline-none transition-all focus:shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFiltersSheet(!showFiltersSheet)}
            className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${showFiltersSheet || sortBy !== "newest"
              ? "bg-[#10b981] text-slate-900 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]"
              : "bg-white text-slate-900 border-slate-200 hover:border-slate-900 hover:shadow-[3px_3px_0px_0px_#0f172a]"
              }`}
          >
            <Filter size={18} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Categories Horizontal Carousel */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1.5 -mx-6 px-6">
          {CATEGORIES.map(cat => {
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-2 ${activeCategory === cat
                  ? "bg-[#10b981] text-slate-900 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-950"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      {/* Task List Feed */}
      <div className="p-6 space-y-4 pb-32 z-10">
        {sortedTasks.length === 0 ? (
          <div className="neo-glass-card p-10 text-center space-y-3 shadow-none">
            <div className="text-3xl">🔍</div>
            <h4 className="font-extrabold text-slate-900 uppercase">No tasks found</h4>
            <p className="text-xs text-slate-450 font-semibold max-w-xs mx-auto">
              Try updating search queries, filters, or select another category!
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setCurrencyFilter("ALL");
                setSortBy("newest");
              }}
              className="mt-2 text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-wider flex items-center gap-1 mx-auto"
            >
              <FilterX size={12} /> Clear all filters
            </button>
          </div>
        ) : (
          sortedTasks.map(task => {
            const isSameCollege = task.posterCollege === user.college;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/app/tasks/${task.id}`)}
                className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-[24px] p-5 cursor-pointer relative overflow-hidden flex flex-col gap-4 group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all"
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img
                        src={task.posterAvatar}
                        alt={task.posterName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-slate-900 leading-tight">{task.posterName}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-slate-500 font-medium">{task.category}</span>
                          {isSameCollege && (
                            <span className="bg-[#fef08a] text-slate-900 border border-slate-900 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-sm">
                              DTU Priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Flag & Bookmark */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportingTask(task);
                        }}
                        className="transition-colors p-2 rounded-full hover:bg-red-50 border border-transparent hover:border-red-100 text-slate-400 hover:text-red-500"
                      >
                        <Flag size={18} />
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(e, task.id)}
                        className={`transition-colors p-2 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 ${bookmarkedTasks.includes(task.id) ? "text-yellow-500" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        <Bookmark size={20} className={bookmarkedTasks.includes(task.id) ? "fill-yellow-500" : ""} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight tracking-tight">
                      {task.title}
                    </h3>
                  </div>

                  {/* Skills chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {task.skillsRequired.slice(0, 3).map(skill => (
                      <span key={skill} className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-slate-700 bg-slate-100 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                    {task.skillsRequired.length > 3 && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-slate-500 border border-transparent">
                        +{task.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Highlighted Payout, Deadline, Location */}
                  <div className="flex flex-col gap-3 pt-4 border-t-2 border-slate-100 mt-2">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Payout</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 text-3xl tracking-tighter leading-none">
                            {task.currency === "CERN" ? "" : "₹"}{task.rewardAmount}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 border-slate-900 shadow-sm ${task.currency === "CERN"
                            ? "bg-[#6ee7b7] text-slate-900"
                            : "bg-[#93c5fd] text-slate-900"
                            }`}>
                            {task.currency}
                          </span>
                        </div>
                      </div>

                      <div className="w-11 h-11 rounded-full bg-slate-100 group-hover:bg-[#10b981] group-hover:text-white text-slate-400 flex items-center justify-center transition-all border-2 border-transparent group-hover:border-slate-900 group-hover:shadow-[2px_2px_0px_0px_#0f172a]">
                        <ChevronRight size={22} strokeWidth={2.5} />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span className="font-bold text-xs text-slate-600">{task.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="font-bold text-xs text-slate-600">{task.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Report Task Modal */}
      <AnimatePresence>
        {reportingTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setReportingTask(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <div className="absolute inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="bg-white/70 backdrop-blur-2xl w-full max-w-sm rounded-[32px] p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] pointer-events-auto border border-white/60 flex flex-col gap-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[14px] bg-[#10b981] flex items-center justify-center text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                      <Flag size={20} strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report Task</h2>
                  </div>
                  <button 
                    onClick={() => setReportingTask(null)}
                    className="text-slate-500 hover:text-slate-900 transition-colors bg-white/40 backdrop-blur-md hover:bg-white/60 p-2 rounded-xl border border-white/50 shadow-sm"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Task Info */}
                <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-800">Task being reported:</span>
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg leading-tight mb-1">{reportingTask.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Posted by: {reportingTask.posterName}</p>
                </div>

                {/* Reason */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-emerald-500 font-bold text-lg">*</span>
                    <span className="text-sm font-bold text-slate-800">Reason for reporting</span>
                  </div>
                  <div className="relative">
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 outline-none appearance-none focus:bg-white/80 focus:border-emerald-300 transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select a reason for reporting</option>
                      <option value="spam">Spam or misleading</option>
                      <option value="inappropriate">Inappropriate content</option>
                      <option value="scam">Potential scam</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <ChevronRight size={18} strokeWidth={2.5} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm font-bold text-slate-800">Additional details</span>
                    <span className="text-xs font-medium text-slate-500">(optional)</span>
                  </div>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any additional context or details about why you're reporting this task..."
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-xl p-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none resize-none h-28 focus:bg-white/80 focus:border-emerald-300 transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setReportingTask(null)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm hover:bg-white/70 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setReportingTask(null);
                      setReportReason("");
                      setReportDetails("");
                    }}
                    className="flex-[1.5] flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider text-slate-900 bg-[#10b981] border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all active:translate-y-0 active:shadow-none"
                  >
                    <Flag size={18} strokeWidth={3} />
                    Submit Report
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Advanced Filter Modal Sheet */}
      <AnimatePresence>
        {showFiltersSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersSheet(false)}
              className="absolute inset-0 bg-slate-900 z-40"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-0 left-0 right-0 bg-white rounded-b-[32px] border-b-2 border-slate-900 shadow-2xl z-50 p-6 pt-8 space-y-6"
            >

              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Sort & Filter Opportunities</h3>
              </div>

              {/* Currency Select */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Currency Economy</label>
                <div className="flex gap-2.5">
                  {[
                    { label: "All Currencies", value: "ALL" },
                    { label: "$CERN Tokens", value: "CERN" },
                    { label: "INR (Cash)", value: "INR" }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setCurrencyFilter(opt.value as any)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${currencyFilter === opt.value
                        ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                        : "bg-white text-slate-500 border-slate-200"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort logic */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Sort by</label>
                <div className="flex gap-2.5">
                  {[
                    { label: "Newest First", value: "newest" },
                    { label: "Highest Reward", value: "highest" },
                    { label: "Deadline Soon", value: "deadline" }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value as any)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${sortBy === opt.value
                        ? "bg-[#10b981] text-slate-900 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset button */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrencyFilter("ALL");
                    setSortBy("newest");
                    setShowFiltersSheet(false);
                  }}
                  className="flex-1 btn-neo-glass-secondary py-3 text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowFiltersSheet(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-955 text-white border border-slate-950 rounded-xl py-3 text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-4" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
