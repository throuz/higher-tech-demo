import React, { type ReactNode } from "react";
import "./HoverCard.css";

interface HoverCardProps {
  children: ReactNode;
}

const HoverCard: React.FC<HoverCardProps> = ({ children }) => {
  return (
    <div className="hover-card">
      <div className="hover-card-content">{children}</div>
    </div>
  );
};

export default HoverCard;
