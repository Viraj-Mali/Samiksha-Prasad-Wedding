import React, { useEffect, useState } from 'react';

/* ─── Particle definitions ─────────────────────────────── */
const ALL = [
  { e:'🌸', l:'3%',  dur:24, del:0,    sz:18, sw:12  },
  { e:'🌿', l:'9%',  dur:28, del:2.8,  sz:14, sw:-10 },
  { e:'🦋', l:'16%', dur:21, del:5.2,  sz:17, sw:14  },
  { e:'🌸', l:'24%', dur:26, del:1.0,  sz:20, sw:-8  },
  { e:'✨', l:'33%', dur:19, del:3.8,  sz:12, sw:6   },
  { e:'🍃', l:'42%', dur:25, del:6.5,  sz:14, sw:-12 },
  { e:'🌸', l:'51%', dur:23, del:0.6,  sz:16, sw:10  },
  { e:'🦋', l:'60%', dur:22, del:7.2,  sz:16, sw:-9  },
  { e:'🌿', l:'68%', dur:27, del:4.1,  sz:13, sw:8   },
  { e:'✨', l:'76%', dur:20, del:8.5,  sz:11, sw:-6  },
  { e:'🌸', l:'84%', dur:25, del:1.9,  sz:19, sw:11  },
  { e:'🍃', l:'92%', dur:29, del:9.8,  sz:13, sw:-8  },
];

const FloatingParticles = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Reduce particle count on mobile
  const particles = mobile ? ALL.filter((_, i) => i % 3 === 0) : ALL;

  return (
    <>
      <style>{`
        @keyframes __fall {
          0%   { transform:translateY(-10vh) rotate(0deg) scale(0.85);  opacity:0; }
          7%   { opacity:0.75; transform:translateY(0vh) rotate(18deg) scale(1); }
          93%  { opacity:0.5; }
          100% { transform:translateY(110dvh) rotate(400deg) scale(0.9); opacity:0; }
        }
        @keyframes __sway {
          0%,100% { margin-left:0; }
          30%      { margin-left:var(--sw); }
          70%      { margin-left:calc(var(--sw) * -0.7); }
        }
        @keyframes __flutter {
          0%,100% { transform:scaleX(1); }
          50%      { transform:scaleX(0.55); }
        }
      `}</style>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1, overflow:'hidden' }}>
        {particles.map((p, i) => {
          const mobileDur = 22 + (p.dur % 14); // Ensures 22s to 35s on mobile
          const finalDur = mobile ? mobileDur : p.dur;
          return (
            <span key={i} style={{
              position:'absolute', left:p.l, top:'-30px',
              fontSize:p.sz, lineHeight:1, userSelect:'none',
              '--sw': `${p.sw}px`,
              animation:[
                `__fall ${finalDur}s ${p.del}s linear infinite`,
                `__sway ${finalDur * 0.45}s ${p.del}s ease-in-out infinite`,
                p.e === '🦋' ? `__flutter 0.4s ${p.del}s ease-in-out infinite` : '',
              ].filter(Boolean).join(', '),
              willChange:'transform',
            }}>
              {p.e}
            </span>
          )
        })}
      </div>
    </>
  );
};

export default FloatingParticles;
