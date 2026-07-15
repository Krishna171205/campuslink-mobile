import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Camera, UploadCloud, Shield, CheckCircle, ChevronLeft, Building2, User, Landmark, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export function ProfileSetup() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Personalize
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Step 2: Academic & Skills
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const CATEGORIES = ["Design", "Development", "Writing", "Research", "Tutoring", "Marketing", "Video Editing"];

  // Step 3: Payout Details
  const [upiId, setUpiId] = useState("");

  // Step 4: Verification
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const toggleSkill = (s: string) => {
    setSkills(prev => prev.includes(s) ? prev.filter(sk => sk !== s) : [...prev, s]);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        ...user,
        bio: bio || user.bio,
        college: college || user.college,
        avatar: avatar || user.avatar,
        hasCompletedProfile: true,
        verificationStatus: "VERIFIED" // Auto-verify for prototype demo
      });
      navigate("/app/home");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden h-full">

      {/* Header / Progress bar */}
      <div className="relative z-10 pt-12 pb-4 px-6 flex items-center justify-between">
        {step > 1 ? (
          <button 
            onClick={prevStep}
            className="w-10 h-10 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}

        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-[#10b981] border border-slate-900 shadow-[1px_1px_0px_rgba(15,23,42,1)]" : "w-2 bg-slate-300"}`}
            />
          ))}
        </div>
        {step >= 3 ? (
          <button
            onClick={step === 4 ? handleFinish : nextStep}
            className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            Skip
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 z-10 no-scrollbar">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-4"
            >
              <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <User size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Personalize Profile</h2>
                <p className="text-sm font-semibold text-slate-500">How should the campus know you?</p>
              </div>

              <div className="bg-white border-2 border-slate-900 rounded-[20px] p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)] space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-[20px] bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={32} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Photo</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Short Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="E.g. Computer Science Junior passionate about UI/UX and web3."
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-sm font-semibold outline-none focus:border-[#10b981] focus:bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-4"
            >
              <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <Building2 size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Academics & Skills</h2>
                <p className="text-sm font-semibold text-slate-500">Connect with local opportunities.</p>
              </div>

              <div className="bg-white border-2 border-slate-900 rounded-[20px] p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)] space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest">College/University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. Delhi Technological University"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-sm font-semibold outline-none focus:border-[#10b981] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Degree & Year</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech, 3rd Year"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-sm font-semibold outline-none focus:border-[#10b981] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Top Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => {
                      const isSelected = skills.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleSkill(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                            isSelected 
                              ? "bg-[#10b981] text-slate-900 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]" 
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-4"
            >
              <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <Landmark size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payout Details</h2>
                <p className="text-sm font-semibold text-slate-500">How do you want to get paid?</p>
              </div>

              <div className="bg-white border-2 border-slate-900 rounded-[20px] p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)] space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="name@okhdfcbank"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-sm font-semibold outline-none focus:border-[#10b981] focus:bg-white transition-all"
                  />
                  <p className="text-[10px] font-bold text-slate-400 pl-1 mt-1">Earnings will be settled directly to this UPI.</p>
                </div>

                <div className="relative overflow-hidden bg-slate-900 text-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_rgba(10,10,10,1)] mt-4">
                  <div className="relative z-10 flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={12} /> Secure Wallet
                    </span>
                    <h4 className="font-bold text-sm">CERN tokens will be stored in your CampusLink embedded wallet automatically.</h4>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-4"
            >
              <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Identity Verification</h2>
                <p className="text-sm font-semibold text-slate-500">Final step to unlock tasks.</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setIdFile(e.target.files[0]);
                  }}
                />
                
                <input 
                  type="file" 
                  ref={selfieInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setSelfieFile(e.target.files[0]);
                  }}
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 rounded-[20px] p-6 text-center cursor-pointer transition-all ${
                    idFile 
                      ? "bg-emerald-50 border-emerald-500 shadow-[3px_3px_0px_rgba(16,185,129,0.3)]" 
                      : "bg-white border-dashed border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {idFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-emerald-800">College ID Uploaded</p>
                        <p className="text-[10px] font-bold text-emerald-600/70">{idFile.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-700">Upload College ID</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Front side clearly visible</p>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  onClick={() => selfieInputRef.current?.click()}
                  className={`border-2 rounded-[20px] p-6 text-center cursor-pointer transition-all ${
                    selfieFile 
                      ? "bg-emerald-50 border-emerald-500 shadow-[3px_3px_0px_rgba(16,185,129,0.3)]" 
                      : "bg-white border-dashed border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {selfieFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-emerald-800">Selfie Uploaded</p>
                        <p className="text-[10px] font-bold text-emerald-600/70">{selfieFile.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                        <Camera size={24} />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-700">Take a Selfie</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Look straight into the camera</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAF8] via-[#F8FAF8] to-transparent pt-12 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          {step < 4 ? (
            <button
              onClick={nextStep}
              className="w-full bg-[#10b981] text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] rounded-2xl py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 active:translate-y-1 active:shadow-[2px_2px_0px_rgba(15,23,42,1)] transition-all"
            >
              Continue
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading || !idFile || !selfieFile}
              className={`w-full border-2 rounded-2xl py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                loading || !idFile || !selfieFile 
                  ? "bg-slate-200 border-slate-300 text-slate-400 shadow-none" 
                  : "bg-slate-900 text-emerald-400 border-slate-900 shadow-[4px_4px_0px_rgba(16,185,129,0.5)] active:translate-y-1 active:shadow-none cursor-pointer"
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              ) : (
                <>Submit & Finish <CheckCircle size={18} strokeWidth={3} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
