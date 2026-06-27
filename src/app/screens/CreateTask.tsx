import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Check, ChevronRight, PenTool, Layout, Code, FileText, Globe, AlertTriangle, ShieldCheck, Ticket, CreditCard, Send, ExternalLink, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
export function CreateTask() {
  const navigate = useNavigate();
  const { user, tasks, setTasks, setTransactions, setNotifications } = useApp();

  const hasActiveTask = tasks.some(t =>
    (t.helperName === user.name || t.posterName === user.name) &&
    (t.status === "CLAIMED" || t.status === "SUBMITTED" || t.status === "FLAGGED")
  );

  const [step, setStep] = useState(0); // Starts at Step 0: Currency Selector
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showActiveRestrictionModal, setShowActiveRestrictionModal] = useState(false);
  // Form State
  const [currency, setCurrency] = useState<"CERN" | "INR">("INR");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Development");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("Remote");
  const [contact, setContact] = useState("");

  const [rewardAmount, setRewardAmount] = useState(500);
  const [deadline, setDeadline] = useState("2026-06-25");

  // Attachments Mock
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Checkout Modal State
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "net">("card");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const CATEGORIES = ["Design", "Development", "Writing", "Research", "Tutoring"];

  // INR Live Fee Calculations
  const platformFee = Math.max(5, Math.round(rewardAmount * 0.01)); // 1%
  const totalInrToPay = rewardAmount + platformFee;
  const doerReceives = Math.round(rewardAmount * 0.95); // 5% doer fee deducted

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = file.name;
      setAttachments(prev => [...prev, name]);

      // Simulate progress bar
      setUploadProgress(prev => ({ ...prev, [name]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[name];
          if (current >= 100) {
            clearInterval(interval);
            return { ...prev, [name]: 100 };
          }
          return { ...prev, [name]: current + 20 };
        });
      }, 100);
    }
  };

  const removeAttachment = (name: string) => {
    setAttachments(prev => prev.filter(f => f !== name));
  };

  const handleNext = () => {
    // Basic Valids
    if (step === 1 && (!title.trim() || !description.trim())) {
      alert("Please fill in the title and description.");
      return;
    }
    if (step === 2 && (rewardAmount <= 0 || !deadline)) {
      alert("Please enter a valid reward and deadline date.");
      return;
    }

    if (step === 3) {
      // Review Step -> triggers submit
      if (currency === "INR") {
        setShowRazorpay(true);
      } else {
        // CERN submit directly
        submitTaskDirectly();
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const submitTaskDirectly = () => {
    // Deduct CERN tokens if applicable
    if (currency === "CERN") {
      if (user.cernBalance < rewardAmount) {
        alert("Insufficient CERN tokens!");
        return;
      }
      user.cernBalance -= rewardAmount;
      setTransactions(prev => [
        {
          id: Date.now(),
          title: "Task Deposit Paid",
          desc: title,
          amount: -rewardAmount,
          type: "SPENT",
          date: "Just now"
        },
        ...prev
      ]);
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      category,
      skillsRequired: skills.split(",").map(s => s.trim()).filter(s => s),
      rewardAmount,
      currency,
      deadline,
      location,
      contact,
      status: "OPEN" as const,
      posterName: user.name,
      posterAvatar: user.avatar,
      posterCollege: user.college,
      helperName: null,
      helperAvatar: null,
      applicants: []
    };

    setTasks(prev => [newTask, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `🚀 Task Posted successfully: "${title}" (${rewardAmount} ${currency})`,
        time: "Just now",
        type: "System",
        unread: true
      },
      ...prev
    ]);

    setPaymentSuccess(true);
  };

  const confirmRazorpayPayment = () => {
    setShowRazorpay(false);

    // Add INR Spent total
    user.inrSpent += totalInrToPay;

    const newTask = {
      id: Date.now(),
      title,
      description,
      category,
      skillsRequired: skills.split(",").map(s => s.trim()).filter(s => s),
      rewardAmount,
      currency,
      deadline,
      location,
      contact,
      status: "OPEN" as const,
      posterName: user.name,
      posterAvatar: user.avatar,
      posterCollege: user.college,
      helperName: null,
      helperAvatar: null,
      applicants: []
    };

    setTasks(prev => [newTask, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `Task Posted: "${title}" (₹${rewardAmount} INR paid)`,
        time: "Just now",
        type: "System",
        unread: true
      },
      ...prev
    ]);

    setPaymentSuccess(true);
  };

  const isCernGated = user.verificationStatus !== "VERIFIED";

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">

      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-[#F8FAF8]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/50">
        <button
          onClick={() => {
            if (step > 0) setStep(step - 1);
            else navigate(-1);
          }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {step > 0 && (
          <div className="flex gap-2 bg-slate-50/60 border border-slate-200 rounded-full p-1">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-emerald-500 border border-emerald-600' :
                  s < step ? 'w-4 bg-emerald-500 border border-emerald-600' : 'w-2 bg-slate-250 border border-slate-200'
                  }`}
              />
            ))}
          </div>
        )}

        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 z-10 no-scrollbar pb-24">
        {paymentSuccess ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center shadow-[3px_3px_0px_rgba(15,23,42,1)] border-2 border-slate-900 mx-auto">
              <Check size={40} strokeWidth={3} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 uppercase">Task Posted!</h2>
              <p className="text-sm font-semibold text-slate-500 max-w-xs leading-relaxed">
                🎉 Your task has been successfully listed on the Explore Feed for fellow classmates.
              </p>
            </div>

            <div className="neo-glass-card p-5 rounded-2xl w-full text-left max-w-xs space-y-3.5 shadow-none">
              <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b pb-2">Listing Summary</h4>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-450 uppercase">Task</span>
                <span className="font-extrabold text-slate-800 truncate max-w-[150px]">{title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-450 uppercase">Reward</span>
                <span className="font-extrabold text-slate-800">{rewardAmount} {currency}</span>
              </div>
            </div>

            <div className="pt-6 space-y-3 w-full max-w-xs">
              <button
                onClick={() => navigate("/app/tasks")}
                className="w-full btn-neo-glass py-4 text-xs font-black uppercase text-white cursor-pointer"
              >
                View Feed
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
          <AnimatePresence mode="wait">
            {/* Step 0: Currency Selector */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Select Economy</h2>
                  <p className="text-sm font-semibold text-slate-500">Post using tokens or real-money payouts.</p>
                </div>

                <div className="space-y-4">
                  {/* CERN Card */}
                  <div
                    onClick={() => {
                      if (hasActiveTask) {
                        setShowActiveRestrictionModal(true);
                      } else if (!isCernGated) {
                        setCurrency("CERN");
                        setStep(1);
                      } else {
                        setShowVerificationModal(true);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${isCernGated
                      ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                      : currency === "CERN"
                        ? "border-slate-900 bg-emerald-50 shadow-[3px_3px_0px_rgba(15,23,42,1)]"
                        : "border-slate-200 bg-white/60 hover:border-slate-350 cursor-pointer"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-emerald-500 border border-emerald-600/30 p-2 rounded-xl text-white">
                        <Ticket size={20} />
                      </div>

                      {isCernGated && (
                        <span className="bg-yellow-50 text-yellow-600 border border-yellow-250 text-[7px] font-black uppercase px-2 py-0.5 rounded">
                          GATED (UNVERIFIED)
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 uppercase">Pay with $CERN</h4>
                    <p className="text-[10px] text-slate-450 font-semibold leading-normal mt-1 max-w-[240px]">
                      In-platform token economy. Gated behind verified academic credentials.
                    </p>
                  </div>

                  {/* INR Card */}
                  <div
                    onClick={() => {
                      if (hasActiveTask) {
                        setShowActiveRestrictionModal(true);
                      } else {
                        setCurrency("INR");
                        setStep(1);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${currency === "INR"
                      ? "border-slate-900 bg-blue-50 shadow-[3px_3px_0px_rgba(15,23,42,1)]"
                      : "border-slate-200 bg-white/60 hover:border-slate-350"
                      }`}
                  >
                    <div className="bg-blue-500 border border-blue-600/30 p-2 rounded-xl text-white w-9 h-9 flex items-center justify-center mb-2">
                      <span className="font-black text-sm">₹</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 uppercase">Pay with INR (Real Cash)</h4>
                    <p className="text-[10px] text-slate-450 font-semibold leading-normal mt-1 max-w-[240px]">
                      Cash transactions. Platform fee 1%. Minimal reward ₹50. Open to all students.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Help Details</h2>
                  <p className="text-xs font-semibold text-slate-500">Describe the task objectives clearly.</p>
                </div>

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

                  {/* Attachments UI Moved to Step 1 */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-widest">Attachments (Max 5)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer relative hover:border-slate-350 transition-colors bg-white/40 mb-3">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Ticket size={20} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-slate-600">Upload guidelines/files</p>
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map(file => (
                          <div key={file} className="neo-glass-card p-3 flex items-center justify-between shadow-none py-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText size={14} className="text-emerald-500 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-slate-900 truncate px-0.5">{file}</p>
                                {uploadProgress[file] < 100 ? (
                                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1 max-w-[120px]">
                                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${uploadProgress[file]}%` }} />
                                  </div>
                                ) : (
                                  <span className="text-[7px] text-emerald-500 font-black uppercase tracking-wider block mt-0.5">Uploaded</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachment(file)}
                              className="text-slate-450 hover:text-red-500 font-extrabold text-[9px] uppercase cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Reward & Deadline */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Payout & Deadline</h2>
                  <p className="text-xs font-semibold text-slate-500">Configure budget balances and date filters.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-550">
                      <span>Reward ({currency})</span>
                      {currency === "CERN" && (
                        <span>Available: {user.cernBalance} $CERN</span>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-800 font-black text-sm border-r border-slate-200 pr-3 my-2.5">
                        {currency === "CERN" ? "$CERN" : "₹"}
                      </div>
                      <input
                        type="number"
                        placeholder={currency === "CERN" ? "50" : "500"}
                        value={rewardAmount}
                        onChange={(e) => setRewardAmount(parseInt(e.target.value) || 0)}
                        className="w-full input-neo-glass pl-16 font-black text-xl"
                        min={currency === "CERN" ? 1 : 50}
                      />
                    </div>
                  </div>

                  {/* INR Fee details card */}
                  {currency === "INR" && (
                    <div className="neo-glass-card p-4.5 rounded-2xl space-y-2.5 shadow-none">
                      <h4 className="font-extrabold text-[9px] text-slate-450 uppercase tracking-widest border-b pb-2">INR Fee Breakdown</h4>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Doer Payout</span>
                        <span className="text-slate-800">₹{rewardAmount}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-red-500">
                        <span className="text-red-400">Platform Escrow Fee (1%)</span>
                        <span className="text-red-600">+ ₹{platformFee}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-emerald-600">
                        <span className="text-emerald-500">Classmate Receives (after 5% doer fee)</span>
                        <span className="text-emerald-700">₹{doerReceives}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-black uppercase">
                        <span className="text-slate-900">Total Charged to Poster</span>
                        <span className="text-slate-950 bg-slate-100 border px-2 py-0.5 rounded">₹{totalInrToPay}</span>
                      </div>
                    </div>
                  )}

                  {currency === "CERN" && user.cernBalance < rewardAmount && (
                    <div className="text-xs text-red-500 font-bold bg-red-50 border border-red-200/50 p-3.5 rounded-2xl flex items-center gap-2">
                      <AlertTriangle size={15} />
                      <span>Insufficient CERN Balance. Adjust tokens in simulation panel if needed.</span>
                    </div>
                  )}

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

            {/* Step 3: Summary & Submit (previously step 4) */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Review & Publish</h2>
                  <p className="text-xs font-semibold text-slate-550">Validate final summary before listing.</p>
                </div>

                <div className="neo-glass-card p-5 space-y-4 shadow-none bg-white/95">
                  <h4 className="font-extrabold text-[9px] text-slate-450 uppercase tracking-widest border-b pb-2">Final Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase">Title</span>
                      <span className="font-extrabold text-slate-800 truncate max-w-[150px]">{title}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase">Category</span>
                      <span className="font-extrabold text-slate-800">{category}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase">Deadline</span>
                      <span className="font-extrabold text-slate-800">
                        {new Date(deadline).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-emerald-600">
                      <span className="font-bold text-emerald-500 uppercase">Reward</span>
                      <span className="font-black">{rewardAmount} {currency}</span>
                    </div>
                    {currency === "INR" && (
                      <div className="flex justify-between items-center text-xs text-red-500">
                        <span className="font-bold text-red-400 uppercase">Platform Fee (1%)</span>
                        <span className="font-black">+ ₹{platformFee}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="font-black text-slate-900 uppercase">Total Payment</span>
                      <span className="font-black text-emerald-650 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded shadow-sm">
                        {currency === "CERN" ? `${rewardAmount} CERN` : `₹${totalInrToPay}`}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Persistent CTA Button scaffold */}
      {!paymentSuccess && (
        <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-200/50 pb-8 md:pb-6 z-20 sticky bottom-0">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full btn-neo-glass py-4 flex items-center justify-center gap-3 cursor-pointer text-white font-bold"
          >
            <span className="text-lg">
              {step === 0 ? "Continue" :
                step === 3
                  ? (currency === "INR" ? `Pay ₹${totalInrToPay} via Razorpay` : `Post Task (-${rewardAmount} CERN)`)
                  : "Continue"}
            </span>
            {step === 3 ? <Check size={22} strokeWidth={2.5} /> : <ChevronRight size={22} strokeWidth={2.5} />}
          </motion.button>
        </div>
      )}

      {/* Razorpay Simulator Modal Checkout */}
      <AnimatePresence>
        {showRazorpay && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRazorpay(false)}
              className="absolute inset-0 bg-slate-950 z-[90]"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] border-t-2 border-slate-900 shadow-2xl z-[100] p-6 space-y-6"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />

              <div className="flex justify-between items-center border-b pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="bg-[#172B4D] text-white px-2 py-0.5 rounded text-[8px] font-black">razorpay</span>
                  <span className="text-xs font-extrabold text-slate-800">CampusLink Checkout</span>
                </div>
                <span className="font-black text-slate-900 text-xs">₹{totalInrToPay}</span>
              </div>

              {/* Payment selector */}
              <div className="flex gap-2">
                {[
                  { id: "card", label: "Cards", icon: <CreditCard size={14} /> },
                  { id: "upi", label: "UPI Apps", icon: <Send size={14} /> },
                  { id: "net", label: "Net Bank", icon: <ExternalLink size={14} /> }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase border-2 flex items-center justify-center gap-1.5 cursor-pointer transition-all ${paymentMethod === opt.id
                      ? "bg-[#10b981] text-slate-900 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                      : "bg-white text-slate-500 border-slate-200"
                      }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {paymentMethod === "card" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number (4111 2222 3333 4444)"
                      className="w-full input-neo-glass py-2.5 text-xs text-center tracking-widest font-mono"
                      readOnly
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Expiry (MM/YY)"
                        className="w-full input-neo-glass py-2.5 text-xs text-center"
                        readOnly
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        className="w-full input-neo-glass py-2.5 text-xs text-center"
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter VPA Address (e.g. user@okhdfc)"
                      className="w-full input-neo-glass py-2.5 text-xs text-center font-bold"
                      readOnly
                    />
                    <p className="text-[9px] text-slate-400 font-bold uppercase text-center">Or scan QR Code presented in native sheet</p>
                  </div>
                )}

                {paymentMethod === "net" && (
                  <div className="space-y-3">
                    <select
                      className="w-full input-neo-glass py-2 text-xs font-bold"
                      disabled
                    >
                      <option>SBI Retail Banking</option>
                      <option>HDFC Bank Netbanking</option>
                      <option>ICICI Bank Retail</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={confirmRazorpayPayment}
                className="w-full bg-[#10B981] hover:bg-emerald-650 text-white border border-emerald-600 py-4 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm active:scale-95"
              >
                Simulate Successful Payment
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Verification Required Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVerificationModal(false)}
              className="absolute inset-0 bg-slate-950 z-[110]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-sm bg-white rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] z-[120] p-6 space-y-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500" />
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-yellow-100 border-2 border-yellow-200 flex items-center justify-center text-yellow-600 shadow-sm relative">
                  <AlertTriangle size={32} strokeWidth={2} />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white">
                    <ShieldCheck size={12} className="text-white" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Verification Required</h3>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
                    Complete account verification before using Cern payments and unlocking the full campus economy.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => { setShowVerificationModal(false); navigate("/app/verification"); }}
                  className="w-full bg-[#10B981] hover:bg-emerald-600 text-white border-2 border-slate-900 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)] active:scale-95 transition-transform"
                >
                  Verify Now
                </button>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-transform"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active Task Restriction Modal */}
      <AnimatePresence>
        {showActiveRestrictionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActiveRestrictionModal(false)}
              className="absolute inset-0 bg-slate-950 z-[110]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-sm bg-white rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] z-[120] p-6 space-y-6 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-600 shadow-sm relative">
                  <AlertTriangle size={32} strokeWidth={2} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 uppercase">One Task at a Time</h3>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
                    You already have an active task. Please complete or resolve your current task before creating a new one.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowActiveRestrictionModal(false)}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white border-2 border-slate-900 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)] active:scale-95 transition-transform"
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