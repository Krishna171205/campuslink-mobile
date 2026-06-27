import { useNavigate } from "react-router";
import { ArrowLeft, BellRing, Coins, CheckCircle2, MessageSquare, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const mockNotifications = [
  {
    id: 1,
    type: "payment",
    icon: <Coins size={16} />,
    title: "Payment Received",
    desc: "You received 50 CERN for completing 'Design UI kit'.",
    time: "2m ago",
    unread: true,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 2,
    type: "system",
    icon: <CheckCircle2 size={16} />,
    title: "Verification Approved",
    desc: "Your student ID has been verified successfully.",
    time: "1h ago",
    unread: true,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    type: "message",
    icon: <MessageSquare size={16} />,
    title: "New Message",
    desc: "Rahul sent you a message regarding 'Physics Notes'.",
    time: "3h ago",
    unread: false,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    type: "task",
    icon: <Briefcase size={16} />,
    title: "Task Assigned",
    desc: "You were assigned to 'Campus Tour Guide'.",
    time: "1d ago",
    unread: false,
    color: "bg-amber-100 text-amber-600",
  }
];

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <div className="flex flex-col h-full bg-slate-50/50 absolute inset-0 z-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/80 border-b border-slate-200/50 shadow-sm backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 cursor-pointer text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
        </div>
        {notifications.some(n => n.unread) && (
          <button 
            onClick={markAllAsRead}
            className="text-xs font-bold text-emerald-600 uppercase tracking-widest cursor-pointer hover:text-emerald-700"
          >
            Mark All Read
          </button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        <AnimatePresence>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif, idx) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl border ${
                    notif.unread 
                      ? "bg-white border-emerald-200 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.15)] relative overflow-hidden" 
                      : "bg-slate-50/80 border-slate-200 shadow-sm opacity-80"
                  }`}
                >
                  {notif.unread && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.color}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{notif.title}</h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 leading-snug">{notif.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center h-full text-slate-400 mt-20"
            >
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <BellRing size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-1">All caught up!</h3>
              <p className="text-sm font-medium">No new notifications right now.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}