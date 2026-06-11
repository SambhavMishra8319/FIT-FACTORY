import { useEffect, useState } from "react";
import logo from "../../assests/f2-logo.png";
export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = black screen
  // phase 1 = particles appear
  // phase 2 = logo draws in
  // phase 3 = tagline fades up
  // phase 4 = fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => setPhase(4), 4200);
    const t5 = setTimeout(() => onDone(), 5000);

    // const t1 = setTimeout(() => setPhase(1), 1000);
    // const t2 = setTimeout(() => setPhase(2), 6000);
    // const t3 = setTimeout(() => setPhase(3), 14000);
    // const t4 = setTimeout(() => setPhase(4), 28000);
    // const t5 = setTimeout(() => onDone(), 34000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: phase === 4 ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
    >
      {/* Animated background particles */}
      <Particles visible={phase >= 1} />

      {/* Center logo group */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          opacity: phase >= 2 ? 1 : 0,
          transform:
            phase >= 2
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.9)",
          transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Logo mark — animated barbell/F2 icon */}
        <LogoMark visible={phase >= 2} />

        {/* F2 FIT FACTORY text */}
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            letterSpacing: "6px",
            textAlign: "center",
            lineHeight: 1.1,
            marginTop: 5,
          }}
        >
          <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    marginTop: -6,

    opacity: phase >= 3 ? 1 : 0,

    transform:
      phase >= 3
        ? "translateY(0)"
        : "translateY(10px)",

    transition:
      "all 0.6s cubic-bezier(0.22,1,0.36,1)",
  }}
>
  {/* BY */}
  <div
    style={{
      fontFamily: "'Rajdhani', sans-serif",

      fontSize: "clamp(20px, 2.6vw, 16px)",

      fontWeight: 650,

      letterSpacing: "6px",

      color: "#b8931a",

      marginBottom: "-2px",

      textTransform: "uppercase",
    }}
  >
    BY
  </div>

  {/* NIMESH MISHRA */}
  <div
    style={{
      fontFamily: "'Orbitron', sans-serif",

      fontSize: "clamp(22px, 4.8vw, 30px)",

      fontWeight: 900,

      letterSpacing: "3.8px",

      background:
        "linear-gradient(135deg, #d4a900 0%, #ffe27a 45%, #c99700 100%)",

      backgroundSize: "200% auto",

      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",

      animation:
        phase >= 2
          ? "shimmer-text-anim 3s linear infinite"
          : "none",

      textTransform: "uppercase",

      lineHeight: 1,
    }}
  >
    NIMESH MISHRA
  </div>
</div>
          
          {/* <div
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              // fontSize: "clamp(28px, 8vw, 42px)",
              fontSize: "clamp(18px, 4.8vw, 28px)",
              // background:
              background:
  "linear-gradient(135deg, #d4a900 0%, #ffd84d 30%, #ffeb85 50%, #ffd84d 70%, #c99700 100%)",
              //   "linear-gradient(135deg, #c9a227 0%, #fcd95b 40%, #f5c842 55%, #fcd95b 70%, #c9a227 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation:
                phase >= 2 ? "shimmer-text-anim 2.5s linear infinite" : "none",
              opacity: phase >= 2 ? 1 : 0,
              transition: "opacity 0.5s ease 0.2s",
              letterSpacing: "2px"
            }}
          >
            BY NIMESH MISHRA
          </div> */}
          <div
            style={{
              fontSize: "clamp(28px, 8vw, 42px)",
              background:
                "linear-gradient(135deg, #c9a227 0%, #fcd95b 40%, #f5c842 55%, #fcd95b 70%, #c9a227 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation:
                phase >= 2
                  ? "shimmer-text-anim 2.5s linear infinite 0.15s"
                  : "none",
              opacity: phase >= 2 ? 1 : 0,
              transition: "opacity 0.5s ease 0.35s",
            }}
          >
            {/* FACTORY */}
          </div>
        </div>

        {/* Gold divider line */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #f5c842, transparent)",
            width: phase >= 2 ? "200px" : "0px",
            transition: "width 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s",
            margin: "14px 0",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: "'Exo 2', sans-serif",
            // fontSize: "clamp(11px, 3vw, 13px)",
            fontSize: "clamp(16px, 4vw, 20px)",
            letterSpacing: "4px",
            color: "#888",
            textTransform: "uppercase",
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          
        </div>

        {/* Location */}
        <a
  href="https://maps.google.com/?q=Mandla,Madhya+Pradesh"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    textDecoration: "none",
  }}
>
  <div
    style={{
      fontFamily: "'Exo 2', sans-serif",
      fontSize: "clamp(11px, 2.8vw, 13px)",
      letterSpacing: "2px",
      color: "#f5c842",
      marginTop: 8,
      cursor: "pointer",

      opacity: phase >= 3 ? 1 : 0,
      transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",

      transition:
        "all 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s",
    }}
  >
    
  </div>
</a>
      </div>

      {/* Bottom loading bar */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: "160px",
          height: "2px",
          background: "#1c1c1c",
          borderRadius: "2px",
          overflow: "hidden",
          opacity: phase >= 2 && phase < 4 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #c9a227, #fcd95b, #c9a227)",
            backgroundSize: "200% 100%",
            animation:
              phase >= 2
                ? "loading-bar 2s ease forwards, shimmer-bar 1.5s linear infinite"
                : "none",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Inline keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Exo+2:wght@400&display=swap');

        @keyframes shimmer-text-anim {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes loading-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes shimmer-bar {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes particle-float {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50%  { opacity: 1; }
          100% { transform: translateY(-120px) rotate(180deg); opacity: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(110px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(110px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(140px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(140px) rotate(-600deg); }
        }
        @keyframes logo-draw {
          from { stroke-dashoffset: 400; opacity: 0; }
          to   { stroke-dashoffset: 0;   opacity: 1; }
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.15; }
          50%       { transform: scale(1.08); opacity: 0.25; }
        }
        @keyframes dumbbell-glow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(245,200,66,0.3)); }
          50%       { filter: drop-shadow(0 0 18px rgba(245,200,66,0.6)); }
        }
          @keyframes logoFloat {
  0%, 100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes logoGlow {
  0%, 100% {
    filter:
      drop-shadow(0 0 10px rgba(245,200,66,0.25))
      drop-shadow(0 0 30px rgba(245,200,66,0.08));
  }

  50% {
    filter:
      drop-shadow(0 0 22px rgba(245,200,66,0.55))
      drop-shadow(0 0 60px rgba(245,200,66,0.18));
  }
}
      `}</style>
    </div>
  );
}

// ── Particles ───────────────────────────────────────────
function Particles({ visible }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 3,
    duration: 2.5 + Math.random() * 2,
    opacity: 0.2 + Math.random() * 0.5,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#f5c842",
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Logo mark — animated dumbbell / F2 icon ─────────────
// function LogoMark({ visible }) {
//   return (
//     <div style={{
//       position: "relative",
//       width: 120, height: 120,
//       display: "flex", alignItems: "center", justifyContent: "center",
//     }}>
//       {/* Pulsing ring */}
//       <div style={{
//         position: "absolute",
//         width: 110, height: 110,
//         borderRadius: "50%",
//         border: "1px solid rgba(245,200,66,0.2)",
//         animation: visible ? "ring-pulse 2s ease infinite" : "none",
//       }} />
//       <div style={{
//         position: "absolute",
//         width: 90, height: 90,
//         borderRadius: "50%",
//         border: "1px solid rgba(245,200,66,0.12)",
//         animation: visible ? "ring-pulse 2s ease infinite 0.4s" : "none",
//       }} />

//       {/* Orbiting dots */}
//       {visible && <>
//         <div style={{
//           position: "absolute",
//           width: 8, height: 8,
//           borderRadius: "50%",
//           background: "#f5c842",
//           animation: "orbit 3s linear infinite",
//         }} />
//         <div style={{
//           position: "absolute",
//           width: 5, height: 5,
//           borderRadius: "50%",
//           background: "#c9a227",
//           animation: "orbit2 4s linear infinite",
//         }} />
//         <div style={{
//           position: "absolute",
//           width: 4, height: 4,
//           borderRadius: "50%",
//           background: "#fcd95b",
//           opacity: 0.6,
//           animation: "orbit3 5s linear infinite",
//         }} />
//       </>}

//       {/* SVG dumbbell icon */}
//       <svg
//         width="70" height="70"
//         viewBox="0 0 70 70"
//         fill="none"
//         style={{
//           position: "relative", zIndex: 1,
//           animation: visible ? "dumbbell-glow 2s ease infinite" : "none",
//           opacity: visible ? 1 : 0,
//           transition: "opacity 0.5s ease 0.3s",
//         }}
//       >
//         {/* Outer circle bg */}
//         <circle cx="35" cy="35" r="33"
//           fill="rgba(245,200,66,0.08)"
//           stroke="#c9a227"
//           strokeWidth="1"
//         />

//         {/* Dumbbell bar */}
//         <rect x="12" y="33" width="46" height="4" rx="2"
//           fill="url(#barGrad)"
//         />

//         {/* Left weights */}
//         <rect x="10" y="24" width="8" height="22" rx="3"
//           fill="url(#weightGrad)"
//         />
//         <rect x="6" y="27" width="6" height="16" rx="3"
//           fill="url(#weightGrad2)"
//         />

//         {/* Right weights */}
//         <rect x="52" y="24" width="8" height="22" rx="3"
//           fill="url(#weightGrad)"
//         />
//         <rect x="58" y="27" width="6" height="16" rx="3"
//           fill="url(#weightGrad2)"
//         />

//         {/* F2 text in center */}
//         <text
//           x="35" y="40"
//           textAnchor="middle"
//           fontFamily="Orbitron, sans-serif"
//           fontWeight="900"
//           fontSize="13"
//           fill="#f5c842"
//           letterSpacing="1"
//         >
//           F2
//         </text>

//         <defs>
//           <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
//             <stop offset="0%"   stopColor="#c9a227" />
//             <stop offset="50%"  stopColor="#fcd95b" />
//             <stop offset="100%" stopColor="#c9a227" />
//           </linearGradient>
//           <linearGradient id="weightGrad" x1="0" y1="0" x2="1" y2="0">
//             <stop offset="0%"   stopColor="#c9a227" />
//             <stop offset="100%" stopColor="#f5c842" />
//           </linearGradient>
//           <linearGradient id="weightGrad2" x1="0" y1="0" x2="1" y2="0">
//             <stop offset="0%"   stopColor="#8a6d0f" />
//             <stop offset="100%" stopColor="#c9a227" />
//           </linearGradient>
//         </defs>
//       </svg>
//     </div>
//   );
function LogoMark({ visible }) {
  return (
    <div
      style={{
        position: "relative",
        width: "min(90vw, 720px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
      }}
    >
      {/* Outer glow */}
      <div
        style={{
          position: "absolute",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background: "rgba(245,200,66,0.08)",
          filter: "blur(80px)",
          animation: visible ? "ring-pulse 3s ease-in-out infinite" : "none",
        }}
      />

      {/* Orbit particles */}
      {visible && (
        <>
          <div
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#f5c842",
              animation: "orbit 5s linear infinite",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#c9a227",
              animation: "orbit2 7s linear infinite",
            }}
          />
        </>
      )}

      {/* Actual logo */}
      <img
        src={logo}
        alt="F2 Fit Factory"
        draggable="false"
        style={{
          width: "100%",
          maxWidth: 820,
          objectFit: "contain",
          position: "relative",
          zIndex: 2,

          opacity: visible ? 1 : 0,

          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.82) translateY(20px)",

          transition: "all 1s cubic-bezier(0.22,1,0.36,1)",

          animation: visible
            ? `
              logoFloat 4s ease-in-out infinite,
              logoGlow 3s ease-in-out infinite
            `
            : "none",

          filter: `
            drop-shadow(0 0 12px rgba(245,200,66,0.18))
            drop-shadow(0 0 36px rgba(245,200,66,0.10))
          `,
        }}
      />
    </div>
  );
}
