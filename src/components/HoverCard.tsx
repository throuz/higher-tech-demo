import React, { type ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
}

const HoverCard: React.FC<HoverCardProps> = ({ children }) => {
  return (
    <div className="relative w-[300px] p-5 rounded-2xl bg-gradient-to-br from-[#646cffaa] to-[#61dafbaa] animate-gradient transition-all duration-300 ease-in-out cursor-pointer hover:animate-float group">
      <div className="relative z-10 text-white">{children}</div>
      <div className="absolute inset-0 bg-inherit rounded-2xl blur-none group-hover:blur-xl group-hover:scale-105 transition-all duration-300 -z-10 group-hover:glow" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#646cff80] to-[#61dafb80] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-20" />
    </div>
  );
};

export default HoverCard;
