import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface HoverCardProps {
  children: ReactNode;
}

const HoverCard = ({ children }: HoverCardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = container.current;
      const blur = blurRef.current;
      const glow = glowRef.current;

      if (!card || !blur || !glow) return;

      // Reset initial states
      gsap.set(blur, { scale: 1, filter: "blur(0px)" });
      gsap.set(glow, { opacity: 0 });
      gsap.set(card, { y: 0 });

      // Create hover animations
      const enterAnimation = gsap
        .timeline({ paused: true })
        .to(blur, {
          scale: 1.05,
          filter: "blur(12px)",
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          glow,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        )
        .to(
          card,
          {
            y: -10,
            duration: 0.4,
            ease: "power2.out",
          },
          0
        );

      card.addEventListener("mouseenter", () => enterAnimation.play());
      card.addEventListener("mouseleave", () => enterAnimation.reverse());

      return () => {
        card.removeEventListener("mouseenter", () => enterAnimation.play());
        card.removeEventListener("mouseleave", () => enterAnimation.reverse());
      };
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="relative w-[300px] p-5 rounded-2xl bg-gradient-to-br from-[#646cffaa] to-[#61dafbaa] cursor-pointer"
    >
      <div className="relative z-10 text-white">{children}</div>
      <div
        ref={blurRef}
        className="absolute inset-0 bg-inherit rounded-2xl -z-10"
      />
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-br from-[#646cff80] to-[#61dafb80] rounded-2xl blur-xl -z-20"
      />
    </div>
  );
};

export default HoverCard;
