import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, Clock, MapPin, ChevronRight, Zap, FilterX, HelpCircle, Bookmark, Flag } from "lucide-react";
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
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFiltersSheet(!showFiltersSheet)}
              className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${showFiltersSheet || sortBy !== "newest"
                ? "bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                : "btn-neo-glass-secondary bg-white/70 text-slate-900"
                }`}
            >
              <Filter size={18} strokeWidth={2.5} />
            </motion.button>

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

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFiltersSheet(!showFiltersSheet)}
              className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${showFiltersSheet || sortBy !== "newest"
                ? "bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                : "btn-neo-glass-secondary bg-white/70 text-slate-900"
                }`}
            >
              <Filter size={18} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 z-10">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search titles, descriptions, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full input-neo-glass pl-12 pr-4 py-3 text-xs"
          />
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
                className="neo-glass-card p-5 cursor-pointer relative overflow-hidden flex flex-col gap-4 group hover:-translate-y-0.5 transition-all shadow-none"
              >
                <div className="relative z-10 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img
                        src={task.posterAvatar}
                        alt={task.posterName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <h5 className="text-[10px] font-extrabold text-slate-800 uppercase leading-none">{task.posterName}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[8px] text-slate-400 font-bold uppercase">{task.category}</span>
                          {isSameCollege && (
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-250 text-[7px] font-black uppercase px-1 rounded">
                              🎓DTU PRIORITY
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Currency Badging & Bookmark */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${task.currency === "CERN"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : "bg-blue-50 border-blue-200 text-blue-600"
                        }`}>
                        {task.currency}
                      </span>
                      <button 
                        onClick={(e) => toggleBookmark(e, task.id)}
                        className={`transition-colors ${bookmarkedTasks.includes(task.id) ? "text-yellow-500" : "text-slate-300 hover:text-slate-400"}`}
                      >
                        <Bookmark size={18} className={bookmarkedTasks.includes(task.id) ? "fill-yellow-500" : ""} />
                      </button>
                      <button 
                        onClick={(e) => toggleFlag(e, task.id)}
                        className={`transition-colors ${flaggedTasks.includes(task.id) ? "text-red-500" : "text-slate-300 hover:text-slate-400"}`}
                      >
                        <Flag size={18} className={flaggedTasks.includes(task.id) ? "fill-red-500" : ""} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors uppercase leading-snug">
                      {task.title}
                    </h3>
                  </div>

                  {/* Skills chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {task.skillsRequired.slice(0, 3).map(skill => (
                      <span key={skill} className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-slate-500 bg-slate-900/5">
                        {skill}
                      </span>
                    ))}
                    {task.skillsRequired.length > 3 && (
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-slate-400">
                        +{task.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Card bottom details */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 border-dashed text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><Clock size={12} /> {task.deadline}</span>
                      <span className="flex items-center gap-0.5"><MapPin size={12} /> {task.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-lg">
                        {task.currency === "CERN" ? "" : "₹"}{task.rewardAmount}{task.currency === "CERN" ? "" : ""}
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-slate-100/80 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-colors">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

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
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] border-t-2 border-slate-900 shadow-2xl z-50 p-6 space-y-6"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />

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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
