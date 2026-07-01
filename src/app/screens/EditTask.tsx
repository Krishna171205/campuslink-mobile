import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, ChevronRight, Save } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tasks, setTasks, setNotifications } = useApp();
  
  const taskToEdit = tasks.find(t => t.id === Number(id));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Development");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("Remote");
  const [currency, setCurrency] = useState<"CERN" | "INR">("INR");
  const [rewardAmount, setRewardAmount] = useState(500);
  const [deadline, setDeadline] = useState("2026-06-25");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setSkills(taskToEdit.skillsRequired.join(", "));
      setLocation(taskToEdit.location);
      setCurrency(taskToEdit.currency);
      setRewardAmount(taskToEdit.rewardAmount);
      setDeadline(taskToEdit.deadline);
    }
  }, [taskToEdit]);

  const CATEGORIES = ["Design", "Development", "Writing", "Research", "Tutoring"];

  if (!taskToEdit) {
    return (
      <div className="flex flex-col h-full p-6 justify-center items-center">
        <p className="text-slate-500">Task not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-slate-200 rounded-xl">Go Back</button>
      </div>
    );
  }

  const handleSave = () => {
    if (!title.trim() || !description.trim() || rewardAmount <= 0 || !deadline) {
      alert("Please fill in all required fields properly.");
      return;
    }

    const updatedTask = {
      ...taskToEdit,
      title,
      description,
      category,
      skillsRequired: skills.split(",").map(s => s.trim()).filter(s => s),
      location,
      currency,
      rewardAmount,
      deadline
    };

    setTasks(prev => prev.map(t => t.id === taskToEdit.id ? updatedTask : t));

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `Task updated successfully: "${title}"`,
        time: "Just now",
        type: "System",
        unread: true
      },
      ...prev
    ]);

    setSaveSuccess(true);
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-[#F8FAF8]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/50">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Edit Task</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 z-10 no-scrollbar pb-24 space-y-6">
        {saveSuccess ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center shadow-[3px_3px_0px_rgba(15,23,42,1)] border-2 border-slate-900 mx-auto">
              <Check size={40} strokeWidth={3} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 uppercase">Saved!</h2>
              <p className="text-sm font-semibold text-slate-500 max-w-xs leading-relaxed">
                Your task has been successfully updated.
              </p>
            </div>

            <div className="pt-6 space-y-3 w-full max-w-xs">
              <button
                onClick={() => navigate(`/app/tasks/${taskToEdit.id}`)}
                className="w-full btn-neo-glass py-4 text-xs font-black uppercase text-white cursor-pointer"
              >
                View Task
              </button>
              <button
                onClick={() => navigate("/app/home")}
                className="w-full btn-neo-glass-secondary py-3 text-xs font-black uppercase text-slate-900 cursor-pointer"
              >
                Go Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Redesign council logo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full input-neo-glass text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full input-neo-glass text-xs appearance-none pr-10 cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Description</label>
                <textarea
                  placeholder="Describe deliverables, requirements, and study criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full input-neo-glass min-h-[100px] text-xs resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Skills (Comma sep)</label>
                  <input
                    type="text"
                    placeholder="React, Figma"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full input-neo-glass text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full input-neo-glass text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Currency</label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as "CERN" | "INR")}
                      className="w-full input-neo-glass text-xs appearance-none pr-10 cursor-pointer"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="CERN">$CERN</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Reward</label>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(parseInt(e.target.value) || 0)}
                    className="w-full input-neo-glass text-xs font-bold"
                    min={currency === "CERN" ? 1 : 50}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Select Deadline Date</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full input-neo-glass font-bold text-xs"
                  required
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {!saveSuccess && (
        <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-200/50 pb-8 md:pb-6 z-20 sticky bottom-0">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full btn-neo-glass py-4 flex items-center justify-center gap-3 cursor-pointer text-white font-bold"
          >
            <Save size={20} strokeWidth={2.5} />
            <span className="text-lg">Save Changes</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
