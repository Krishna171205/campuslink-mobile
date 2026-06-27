import React from 'react';

interface CernIconProps {
  className?: string;
  size?: number;
}

export const CernIcon: React.FC<CernIconProps> = ({ className = "", size = 16 }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-[#10B981] border border-slate-900 shadow-[1px_1px_0px_rgba(15,23,42,1)] shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-[60%] h-[60%] rounded-full border-[1.5px] border-slate-900 bg-[#FACC15] flex items-center justify-center">
        <div className="w-[30%] h-[30%] rounded-full bg-slate-900" />
      </div>
    </div>
  );
};
