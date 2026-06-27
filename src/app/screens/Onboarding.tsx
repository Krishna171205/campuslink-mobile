import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Shield, Star, Award, Lock, Zap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import img6 from "../../imports/image-6.png";


const Slide1Illustration = () => {
  return (
    <div className="relative w-full h-full neo-glass-card flex items-center justify-center overflow-hidden p-6">

      {/* Center Image Component */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-48 h-48 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)] overflow-hidden bg-emerald-500"
      >
        <ImageWithFallback src={img6} alt="Student working" className="w-full h-full object-cover mix-blend-multiply opacity-95" />
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-6 bg-white/95 border-2 border-slate-900 rounded-2xl p-3 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center gap-3 z-10"
      >
        <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center border border-slate-900 shadow-[1px_1px_0px_rgba(15,23,42,1)]">
          <Star size={14} className="text-yellow-300 fill-yellow-300 stroke-slate-900" strokeWidth={2} />
        </div>
        <div>
          <div className="h-2 w-12 bg-slate-900/10 rounded-full mb-1.5"></div>
          <div className="h-2 w-8 bg-slate-900/10 rounded-full"></div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-12 right-6 bg-emerald-500 border-2 border-slate-900 rounded-2xl p-3.5 shadow-[3px_3px_0px_rgba(15,23,42,1)] text-white z-10"
      >
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-300 fill-yellow-300 stroke-slate-900" strokeWidth={2.5} />
          <span className="text-sm font-bold tracking-wide text-slate-900">Skill Match</span>
        </div>
      </motion.div>
    </div>
  );
};

const Slide2Illustration = () => {
  return (
    <div className="relative w-full h-full neo-glass-card flex items-center justify-center overflow-hidden p-6">
      {/* Escrow Lock Center */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="z-10 bg-white/95 border-2 border-slate-900 rounded-[24px] p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex flex-col items-center relative"
      >
        <div className="absolute -top-3 -right-3 bg-[#10B981] w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_rgba(15,23,42,1)]">
          <Shield size={14} className="text-yellow-300 fill-yellow-300 stroke-slate-900" strokeWidth={2} />
        </div>

        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center mb-4 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
        >
          <span className="font-bold text-2xl text-slate-900">$</span>
        </motion.div>

        <div className="bg-slate-100/90 px-4 py-2 rounded-xl border border-slate-300 flex items-center gap-2">
          <Lock size={14} className="text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">In Escrow</span>
        </div>
      </motion.div>

      {/* Verification checkmarks appearing */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-1/4 left-8 bg-white border-2 border-slate-900 rounded-full p-2 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
      >
        <Check size={16} className="text-emerald-600" strokeWidth={3.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-1/4 right-8 bg-white border-2 border-slate-900 rounded-full p-2 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
      >
        <Check size={16} className="text-emerald-600" strokeWidth={3.5} />
      </motion.div>

      {/* Path lines */}
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-20">
        <motion.path
          d="M 40 250 C 100 250, 100 50, 200 50"
          stroke="#10B981"
          strokeWidth="3"
          strokeDasharray="6 6"
          fill="none"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </svg>
    </div>
  );
};

const Slide3Illustration = () => {
  return (
    <div className="relative w-full h-full neo-glass-card flex items-center justify-center overflow-hidden p-6">
      {/* Big Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
        className="relative z-10 w-24 h-24 rounded-[28px] bg-emerald-500 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex items-center justify-center rotate-3"
      >
        <motion.svg
          width="48" height="48" viewBox="0 0 24 24" fill="none"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            d="M20 6L9 17L4 12"
            stroke="#0F172A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>

      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-3.5 h-3.5 ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-emerald-400'} rounded-full border border-slate-900 shadow-sm`}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: Math.cos(i * 45 * Math.PI / 180) * 100,
            y: Math.sin(i * 45 * Math.PI / 180) * 100,
          }}
          transition={{ duration: 1.2, delay: 0.6, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}

      {/* Floating UI */}
      <motion.div
        initial={{ y: 20, opacity: 0, rotate: -5 }}
        animate={{ y: 0, opacity: 1, rotate: -5 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="absolute bottom-10 left-8 bg-white/95 border-2 border-slate-900 rounded-2xl px-4 py-2.5 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center gap-2"
      >
        <Award size={18} className="text-yellow-500 fill-yellow-500 stroke-slate-900" />
        <span className="text-sm font-bold text-slate-800">Level Up!</span>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0, rotate: 10 }}
        animate={{ y: 0, opacity: 1, rotate: 10 }}
        transition={{ delay: 1, type: "spring" }}
        className="absolute top-10 right-8 bg-white/95 border-2 border-slate-900 rounded-2xl px-4 py-2.5 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center gap-2"
      >
        <Star size={16} className="text-yellow-400 fill-yellow-400 stroke-slate-900" />
        <span className="text-sm font-bold text-slate-800">+50 Rep</span>
      </motion.div>
    </div>
  );
};

const SLIDES = [
  {
    theme: "Your Campus, Your Tasks",
    title: "Focus on your campus.",
    description: "Post tasks for fellow students or earn by helping others. Pay with CERN tokens or real money.",
    illustration: Slide1Illustration,
  },
  {
    theme: "Dual Economy",
    title: "Use CERN or INR.",
    description: "Use $CERN tokens for in-platform rewards or post tasks with INR for real money payouts.",
    illustration: Slide2Illustration,
  },
  {
    theme: "Verified & Trusted",
    title: "Unlock full features.",
    description: "Verify your college ID to unlock the full CERN economy, earn bonuses, and build your reputation.",
    illustration: Slide3Illustration,
  }
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex >= SLIDES.length - 1) {
      navigate("/login");
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
    }
  };

  const currentSlide = SLIDES[currentIndex] || SLIDES[SLIDES.length - 1];

  return (
    <div className="flex-1 flex flex-col bg-transparent h-full relative overflow-hidden">
      {/* Global Background Graphic Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      {/* Top Nav */}
      <div className="flex items-center justify-between p-6 z-20">
        <div className="flex items-center gap-2">
          {/* Brand logo simple */}
          <div className="w-9 h-9 rounded-lg bg-emerald-500 border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] flex items-center justify-center">
            <span className="text-slate-900 font-black text-sm">CL</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-xs font-bold text-slate-800 uppercase tracking-widest px-4 py-2 btn-neo-glass-secondary rounded-xl bg-white/70 backdrop-blur-md cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 z-10 w-full max-w-md mx-auto relative">

        {/* Illustration Container */}
        <div className="w-full aspect-square mb-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {React.createElement(currentSlide.illustration)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <div className="text-center w-full min-h-[160px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="inline-block bg-emerald-500 text-white border-2 border-slate-900 rounded-xl px-4 py-1.5 mb-5 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                <span className="text-xs font-black uppercase tracking-wider">{currentSlide.theme}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight uppercase">
                {currentSlide.title}
              </h2>
              <p className="text-slate-500 font-medium text-[15px] leading-relaxed px-2 max-w-[280px]">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-6 pb-10 w-full max-w-md mx-auto flex flex-col gap-8 z-20 bg-transparent">

        {/* Progress Indicator */}
        <div className="flex items-center w-full max-w-[160px] mx-auto">
          {[0, 1, 2].map((idx) => (
            <React.Fragment key={idx}>
              <motion.div
                className={`w-4 h-4 rounded-full border-2 z-10 transition-all duration-300 ${currentIndex >= idx
                    ? 'bg-emerald-500 border-slate-900 shadow-[1.5px_1.5px_0px_rgba(15,23,42,1)]'
                    : 'bg-white border-slate-300'
                  }`}
                animate={currentIndex === idx ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
              {idx < 2 && (
                <div className="flex-1 h-[3px] bg-slate-200 relative overflow-hidden -mx-0.5 z-0">
                  <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-slate-900"
                    initial={{ width: "0%" }}
                    animate={{ width: currentIndex > idx ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Primary CTA */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextSlide}
          className="w-full btn-neo-glass py-4 flex items-center justify-center gap-3 cursor-pointer text-white font-bold"
        >
          <span className="text-lg">{currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}</span>
          <ArrowRight size={20} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}