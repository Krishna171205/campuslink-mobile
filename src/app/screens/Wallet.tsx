import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, History, Lock, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { CernIcon } from "../components/ui/CernIcon";

export function Wallet() {
  const navigate = useNavigate();
  const { user, transactions } = useApp();

  const [activeTab, setActiveTab] = useState<"CERN" | "INR">("CERN");
  const [filterType, setFilterType] = useState<"ALL" | "EARNED" | "SPENT" | "BONUS">("ALL");

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === "ALL") return true;
    return tx.type === filterType;
  });

  const isUnverified = user.verificationStatus !== "VERIFIED";

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
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Wallet</h1>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Segmented Control Toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab("CERN")}
            className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer font-black uppercase tracking-widest text-[9px] ${
              activeTab === "CERN" ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" : "text-slate-500"
            }`}
          >
            CERN Tokens
          </button>
          <button
            onClick={() => setActiveTab("INR")}
            className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer font-black uppercase tracking-widest text-[9px] ${
              activeTab === "INR" ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" : "text-slate-500"
            }`}
          >
            INR Summary ₹
          </button>
        </div>

        {/* Tab CERN */}
        {activeTab === "CERN" && (
          <div className="space-y-6">
            {isUnverified ? (
              /* Gated Wallet Card */
              <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-6 text-center space-y-4 relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                  <Lock size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase">CERN Wallet Locked</h4>
                  <p className="text-[10px] text-slate-400 font-semibold px-4 leading-normal">
                    You must verify your college enrollment credentials to access $CERN transactions and balance adjustments.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/app/verification")}
                  className="w-full bg-slate-900 hover:bg-slate-955 text-white border border-slate-950 py-3 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Verify Enrollment Now
                </button>
              </div>
            ) : (
              /* Glowing CERN Balance Card */
              <div className="grid grid-cols-2 gap-4">
                {/* Current Balance */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-2 bg-emerald-400 border-2 border-slate-900 rounded-[20px] p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)] text-slate-900 relative overflow-hidden"
                >
                  <p className="font-black uppercase tracking-widest text-[10px] mb-2 opacity-80">Current Balance</p>
                  <h2 className="text-5xl font-black tracking-tight leading-none flex items-center gap-3">
                    <CernIcon size={32} className="border-slate-900 shadow-none bg-white" /> {user.cernBalance}
                  </h2>
                </motion.div>

                {/* Total Earned */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white border-2 border-slate-900 rounded-[16px] p-4 shadow-[3px_3px_0px_rgba(15,23,42,1)]"
                >
                  <p className="font-black uppercase tracking-widest text-[9px] text-slate-500 mb-1">Total Earned</p>
                  <span className="text-lg font-black text-slate-900">{user.reputation * 0.1} CERN</span>
                </motion.div>

                {/* Bonuses */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-yellow-100 border-2 border-slate-900 rounded-[16px] p-4 shadow-[3px_3px_0px_rgba(15,23,42,1)]"
                >
                  <p className="font-black uppercase tracking-widest text-[9px] text-yellow-700 mb-1">Bonuses</p>
                  <span className="text-lg font-black text-yellow-900">{user.cernFromReferrals} CERN</span>
                </motion.div>
              </div>
            )}

            {/* History section (unlocked view only, or placeholder) */}
            {!isUnverified && (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <History size={14} className="text-emerald-500" /> Token Ledger
                  </h3>
                </div>

                {/* Ledger filter chips */}
                <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
                  {[
                    { label: "All Ledger", value: "ALL" },
                    { label: "Earned", value: "EARNED" },
                    { label: "Spent", value: "SPENT" },
                    { label: "Bonuses", value: "BONUS" }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterType(opt.value as any)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                        filterType === opt.value
                          ? "bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Ledger Items */}
                <div className="space-y-2.5">
                  {filteredTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="neo-glass-card p-4 flex items-center justify-between hover:border-slate-350 transition-all cursor-pointer shadow-none animate-fade-in"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          tx.amount > 0 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          {tx.amount > 0 ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs uppercase truncate max-w-[150px]">{tx.title}</h4>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`font-black text-sm ${
                          tx.amount > 0 ? "text-emerald-600" : "text-slate-800"
                        }`}>
                          {tx.amount > 0 ? "+" : ""}{tx.amount} CERN
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab INR */}
        {activeTab === "INR" && (
          <div className="space-y-6">
            <div className="neo-glass-card-important p-6 space-y-4 bg-white/95 shadow-[3px_3px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
              <h4 className="font-extrabold text-sm text-slate-900 uppercase">INR Ledger Summary</h4>
              <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                CampusLink is a token-gated platform and does not maintain an INR cash wallet. Payments are processed natively through **RazorpayX webhook distributions**.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 border-dashed">
                <div className="p-4 bg-white border-2 border-slate-900 rounded-[16px] shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Total Spent</span>
                  <span className="text-lg font-black text-slate-900 mt-1 block">₹{user.inrSpent}</span>
                </div>
                <div className="p-4 bg-emerald-50 border-2 border-slate-900 rounded-[16px] shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <span className="text-[9px] text-emerald-600 font-black uppercase block">Total Earned</span>
                  <span className="text-lg font-black text-slate-900 mt-1 block">₹{user.inrEarned}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 px-1 text-[10px] font-bold text-slate-450 uppercase tracking-widest leading-relaxed">
              <p>📌 Payout schedule: Instant webhook transfers to linked bank details on task completions.</p>
              <p>📌 Disputes splits: Flagged dispute splits resolve directly to source payment methods.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}