import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MoreVertical, Send, Paperclip, Mic, CheckCircle2, User, Flag, Ban } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

export function ChatDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roomId = id || "";
  const { user, chatRooms, sendChatMessage } = useApp();

  const room = chatRooms.find(r => r.id === roomId);
  const [inputText, setInputText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [room?.messages]);

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <h3 className="font-extrabold text-slate-900 uppercase">Chat Not Found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 font-extrabold">Go Back</button>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    sendChatMessage(roomId, inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full bg-transparent absolute inset-0 z-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-[#F8FAF8]/90 border-b border-slate-200/50 shadow-sm backdrop-blur-md flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/70 border border-slate-200 backdrop-blur-md cursor-pointer text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden">
                <img src={room.avatar} alt={room.name} className="w-full h-full object-cover" />
              </div>
              {room.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm" />
              )}
            </div>
            <div className="space-y-0.5">
              <h2 className="font-extrabold text-slate-900 text-xs uppercase leading-tight">{room.name}</h2>
              <p className={`text-[8px] font-black uppercase tracking-widest ${room.online ? 'text-emerald-500' : 'text-slate-400'}`}>
                {room.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowMenu(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors"
        >
          <MoreVertical size={20} strokeWidth={2.5} />
        </button>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-6 bg-slate-50/30 relative">
        <div className="flex justify-center mb-6">
          <span className="text-[8px] font-black text-slate-400 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 uppercase tracking-widest shadow-sm">
            Chat History
          </span>
        </div>

        {room.messages.map((msg, idx) => {
          const isSender = msg.sender === "me";

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className={`flex items-end gap-3 ${isSender ? "justify-end" : "justify-start"}`}
            >
              {!isSender && (
                <div className="w-7 h-7 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-white/40">
                   <img src={room.avatar} alt={room.name} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className={`p-3.5 rounded-2xl max-w-[78%] relative shadow-sm text-xs leading-relaxed ${
                isSender 
                  ? "bg-emerald-500 border-2 border-slate-900 text-white rounded-br-none shadow-[2px_2px_0px_rgba(15,23,42,1)]" 
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
              }`}>
                <p className={`font-semibold ${isSender ? "font-bold tracking-wide text-[13px]" : ""}`}>
                  {msg.text}
                </p>
                <div className={`text-[8px] font-black uppercase tracking-wider mt-1.5 flex items-center gap-1 ${
                  isSender ? "text-emerald-100 justify-end" : "text-slate-400"
                }`}>
                  {msg.timestamp}
                  {isSender && <CheckCircle2 size={10} className="text-emerald-200" />}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200/50 pb-8 md:pb-4 relative z-20">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button 
            type="button"
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all shrink-0 cursor-pointer"
          >
            <Paperclip size={18} strokeWidth={2.5} />
          </button>
          
          <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center p-1 pl-4 transition-all focus-within:border-emerald-500 shadow-sm">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent py-2.5 text-xs font-bold outline-none text-slate-900 placeholder:text-slate-400"
            />
            <motion.button 
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!inputText.trim()}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ml-2 transition-all shrink-0 border cursor-pointer ${
                inputText.trim() 
                  ? "bg-slate-900 border-slate-950 text-emerald-400 shadow-[2px_2px_0px_rgba(16,185,129,0.4)]" 
                  : "bg-slate-100 border-slate-200 text-slate-400"
              }`}
            >
              <Send size={14} strokeWidth={2.5} className="ml-0.5" />
            </motion.button>
          </div>
        </form>
      </div>

      {/* Bottom Sheet Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t-2 border-slate-900 pb-10"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              
              <div className="space-y-3">
                <button 
                  onClick={() => { setShowMenu(false); navigate(`/app/public-profile/${room.id}`); }} 
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <User size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-extrabold text-slate-900 text-sm uppercase">View Profile</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">See user's reputation and stats</p>
                  </div>
                </button>

                <button 
                  onClick={() => { setShowMenu(false); alert("User Reported"); }} 
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
                    <Flag size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-extrabold text-slate-900 text-sm uppercase">Report User</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Report suspicious behavior</p>
                  </div>
                </button>

                <button 
                  onClick={() => { setShowMenu(false); alert("User Blocked"); }} 
                  className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200">
                    <Ban size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-extrabold text-red-600 text-sm uppercase">Block User</h4>
                    <p className="text-[10px] text-red-400 font-semibold mt-0.5">Prevent future communication</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}