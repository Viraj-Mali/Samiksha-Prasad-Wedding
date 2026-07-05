import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { weddingData } from '../data/index.js';

const customEase = [0.22, 1, 0.36, 1]; // Premium cinematic easing

const galleryStyles = `
  @keyframes galleryFall {
    0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
    10% { opacity: 0.35; }
    90% { opacity: 0.35; }
    100% { transform: translateY(112dvh) rotate(360deg) translateX(40px); opacity: 0; }
  }
`;

const GalleryPetals = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{galleryStyles}</style>
      {[...Array(8)].map((_, i) => {
        // Slow speed for iPhone performance
        const dur = 22 + (i * 2);
        const delay = i * 2.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${8 + (i * 12)}%`,
              top: '-10vh',
              fontSize: i % 3 === 0 ? '14px' : '9px',
              color: 'var(--color-gold)',
              filter: 'blur(1px)',
              opacity: 0,
              animation: `galleryFall ${dur}s linear ${delay}s infinite`,
              willChange: 'transform'
            }}
          >
            ✦
          </div>
        );
      })}
    </div>
  );
};

const PhotoCard = ({ src, caption, isDesktop }) => {
  const [error, setError] = useState(false);
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FDFBF7',
      padding: isDesktop ? '14px 14px 54px 14px' : '10px 10px 44px 10px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.08)',
      borderRadius: '4px',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ flex: 1, overflow: 'hidden', borderRadius: '2px', background: '#EAE6DF' }}>
        {!error && <img src={src} onError={() => setError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} loading="lazy" />}
      </div>
      <div style={{ position: 'absolute', bottom: isDesktop ? '20px' : '14px', left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-sage-dark)', fontSize: isDesktop ? '16px' : '13px' }}>
          {caption || "Forever Moments"}
        </span>
      </div>
    </div>
  );
};

const PhotoStack = () => {
  const { assets } = weddingData;
  const images = assets.galleryImages || [];
  const displayImages = [
    images[0] || '/images/placeholder1.jpg',
    images[1] || '/images/placeholder2.jpg',
    images[2] || '/images/placeholder3.jpg',
    images[3] || '/images/placeholder4.jpg',
    images[4] || '/images/placeholder5.jpg',
  ].slice(0, 5); // Ensure safe array bounds

  const captions = [
    "A beautiful start",
    "Together forever",
    "Our perfect day",
    "Endless love",
    "Cherished memories"
  ];

  // State: Maintain exactly 3 visible photo indices
  const [visibleIndexes, setVisibleIndexes] = useState([0, 1, 2]);
  
  const [isInitialReveal, setIsInitialReveal] = useState(true);
  const timerRef = useRef(null);
  
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shiftImages = () => {
    setVisibleIndexes(prev => {
      const nextIndex = (prev[2] + 1) % displayImages.length;
      return [prev[1], prev[2], nextIndex];
    });
  };

  const handleNext = () => {
    shiftImages();
    // Reset auto interval so it doesn't double-jump if click occurs right before tick
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(shiftImages, 4500);
  };

  useEffect(() => {
    if (!inView) return;
    
    // Disable initial reveal stagger delay after sequence finishes
    const timer1 = setTimeout(() => setIsInitialReveal(false), 3000);
    
    // Auto interval: Stream moves every 4500ms
    timerRef.current = setInterval(shiftImages, 4500);
    
    return () => { 
      clearTimeout(timer1); 
      if (timerRef.current) clearInterval(timerRef.current); 
    };
  }, [inView, displayImages.length]);

  // Fixed visual slots as strictly requested
  const variants = {
    enter: { 
      y: isDesktop ? 230 * 1.3 : 230, scale: 0.75, opacity: 0, zIndex: 5, rotate: 0 
    },
    slot0: { 
      y: 0, scale: 1, opacity: 1, rotate: -1, zIndex: 30 
    },
    slot1: { 
      y: isDesktop ? 70 * 1.3 : 70, scale: 0.92, opacity: 0.78, rotate: 3, zIndex: 20 
    },
    slot2: { 
      y: isDesktop ? 135 * 1.3 : 135, scale: 0.84, opacity: 0.55, rotate: -4, zIndex: 10 
    },
    exit: { 
      y: isDesktop ? -120 * 1.3 : -120, scale: 1.03, opacity: 0, zIndex: 40, rotate: 2 
    }
  };

  return (
    <section ref={ref} className="px-4 overflow-hidden relative" style={{ 
      paddingTop: '100px', 
      paddingBottom: '240px', // Extra bottom padding so buttons do not overlap
      background: 'linear-gradient(180deg, #FDF9F2 0%, #EBF0EB 100%)',
    }}>
      <GalleryPetals />
      
      {/* Soft Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.4, ease: customEase }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 10 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ height: '1px', width: '50px', background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
          <span style={{ color: 'var(--color-gold)', fontSize: '18px' }}>✧</span>
          <div style={{ height: '1px', width: '50px', background: 'linear-gradient(-90deg, transparent, var(--color-gold))' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 8vw, 3.8rem)', color: 'var(--color-choco)', fontWeight: 400, margin: '0 0 12px 0' }}>
          Forever Moments
        </h2>
      </motion.div>

      {/* Vertical Memory Stream Stack Container */}
      <div style={{ position: 'relative', width: '100%', height: isDesktop ? '600px' : '65vh', minHeight: '520px', maxHeight: '700px', margin: '0 auto', zIndex: 10 }}>
        
        {/* Subtle Idle Floating Wrapper */}
        <motion.div 
          animate={inView ? { y: [0, -8, 0] } : {}} 
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} 
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          {/* PopLayout mode is critical for the exit animation to fire smoothly while siblings move up */}
          <AnimatePresence mode="popLayout">
            {inView && visibleIndexes.map((photoIndex, slotIndex) => {
              // The key tracks the actual photo data
              return (
                <motion.div
                  key={photoIndex}
                  layout
                  initial="enter"
                  animate={`slot${slotIndex}`}
                  exit="exit"
                  variants={variants}
                  transition={{ 
                    duration: 1.8, 
                    ease: customEase,
                    delay: isInitialReveal ? slotIndex * 0.4 : 0 // Stagger only the very first entrance
                  }}
                  style={{
                    position: 'absolute',
                    left: 0, right: 0, top: 0, bottom: 0, margin: 'auto', // Perfectly centered
                    width: '82vw', maxWidth: isDesktop ? '380px' : '360px',
                    aspectRatio: '3/4',
                    willChange: 'transform, opacity, z-index',
                    cursor: 'pointer'
                  }}
                  onClick={handleNext}
                >
                  <PhotoCard src={displayImages[photoIndex]} caption={captions[photoIndex]} isDesktop={isDesktop} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoStack;
