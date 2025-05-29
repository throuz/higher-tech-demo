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
  const particlesRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = container.current;
      const blur = blurRef.current;
      const glow = glowRef.current;
      const particles = particlesRef.current;
      const wave = waveRef.current;
      const orb = orbRef.current;

      if (!card || !blur || !glow || !particles || !wave || !orb) return;

      // Reset initial states
      gsap.set(blur, { scale: 1, filter: "blur(0px)" });
      gsap.set(glow, { opacity: 0 });
      gsap.set(card, { y: 0 });

      // Background animations that run continuously

      // Floating particles animation
      const particleElements = particles.children;
      Array.from(particleElements).forEach((particle) => {
        gsap.set(particle, {
          x: Math.random() * 300,
          y: Math.random() * 200,
          scale: Math.random() * 0.5 + 0.3,
          opacity: Math.random() * 0.6 + 0.2,
        });

        gsap.to(particle, {
          y: "-=50",
          x: `+=${Math.random() * 40 - 20}`,
          duration: Math.random() * 4 + 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });

        gsap.to(particle, {
          opacity: Math.random() * 0.6 + 0.2,
          scale: Math.random() * 0.5 + 0.3,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: Math.random() * 1,
        });
      });

      // Wave animation
      gsap.to(wave, {
        backgroundPosition: "200% 0%",
        duration: 8,
        repeat: -1,
        ease: "none",
      });

      // Floating orb animation
      gsap.to(orb, {
        x: 50,
        y: -30,
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(orb, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
      });

      // Create hover animations with drop-shadow glow
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
            filter:
              "drop-shadow(0 0 20px rgba(100, 108, 255, 0.8)) drop-shadow(0 0 40px rgba(97, 218, 251, 0.6)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))",
            duration: 0.4,
            ease: "power2.out",
          },
          0
        )
        .to(
          particles,
          {
            opacity: 0.8,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        )
        .to(
          wave,
          {
            opacity: 0.4,
            duration: 0.3,
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

  // Generate particles for background animation
  const particles = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 rounded-full"
      style={{
        background:
          i % 3 === 0
            ? "#646cff"
            : i % 3 === 1
            ? "#61dafb"
            : "rgba(255,255,255,0.6)",
        boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
      }}
    />
  ));

  return (
    <div
      ref={container}
      className="relative w-[300px] p-5 rounded-2xl bg-gradient-to-br from-[#646cffaa] to-[#61dafbaa] cursor-pointer overflow-hidden"
    >
      {/* Animated wave background */}
      <div
        ref={waveRef}
        className="absolute inset-0 opacity-20 rounded-2xl"
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(100, 108, 255, 0.3) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating orb */}
      <div
        ref={orbRef}
        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-sm"
      />

      {/* Floating particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none opacity-40"
      >
        {particles}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-white">{children}</div>

      {/* Original blur and glow effects */}
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
