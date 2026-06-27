import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ArrowLeft, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function Messages() {
  const navigate = useNavigate();
  const { chatRooms } = useApp();
  const [search, setSearch] = useState("");

  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(search.toLowerCase()) || 
    room.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full bg-transparent relative overflow-x-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-[#F8FAF8]/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50">
        <div className="flex items-center gap-4 mb-6">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-slate-55 cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Messages</h1>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 z-10">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search classmate chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-neo-glass py-3.5 pl-12 pr-4 text-xs"
          />
        </div>
      </header>

      {/* Roster list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32 pt-6 z-10">
        {filteredRooms.length === 0 ? (
          <div className="neo-glass-card p-10 text-center space-y-2.5 shadow-none">
            <MessageSquare size={32} className="text-slate-400 mx-auto" />
            <h4 className="font-extrabold text-slate-900 uppercase text-xs">No conversations</h4>
            <p className="text-[10px] text-slate-450 font-semibold max-w-xs mx-auto">
              Start a conversation directly from any task detail view!
            </p>
          </div>
        ) : (
          filteredRooms.map((chat, i) => (
            <motion.div 
              key={chat.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 22 }}
              onClick={() => navigate(`/app/messages/${chat.id}`)}
              className={`flex items-center gap-4 p-4 transition-all group cursor-pointer ${
                chat.unreadCount > 0 
                  ? 'bg-white/95 border-2 border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)] rounded-2xl' 
                  : 'neo-glass-card hover:border-slate-350 shadow-none'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden">
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                {chat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase">{chat.name}</h4>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
                    chat.unreadCount > 0 
                      ? 'bg-emerald-500 text-white border-emerald-600/30' 
                      : 'border-slate-200 bg-slate-50/60 text-slate-450'
                  }`}>
                    {chat.timestamp}
                  </span>
                </div>
                <p className={`text-xs truncate pr-4 ${chat.unreadCount > 0 ? 'text-slate-900 font-black' : 'text-slate-500 font-semibold'}`}>
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unreadCount > 0 && (
                <div className="w-5.5 h-5.5 bg-emerald-500 text-slate-900 border border-slate-950/20 text-[9px] font-black flex items-center justify-center rounded-full shrink-0 shadow-sm animate-pulse">
                  {chat.unreadCount}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}