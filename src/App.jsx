import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import OpeningEnvelopeScreen from './components/OpeningEnvelopeScreen.jsx';
import FloatingParticles from './components/FloatingParticles.jsx';
import HeroSection from './components/HeroSection.jsx';
import SaveTheDate from './components/SaveTheDate.jsx';
import CountdownTimer from './components/CountdownTimer.jsx';
import CoupleSection from './components/CoupleSection.jsx';
import PhotoStack from './components/PhotoStack.jsx';
import EventDetails from './components/EventDetails.jsx';
import InvitationMessage from './components/InvitationMessage.jsx';
import VenueSection from './components/VenueSection.jsx';
import FamilySection from './components/FamilySection.jsx';
import Footer from './components/Footer.jsx';
import MusicButton from './components/MusicButton.jsx';
import FloatingActions from './components/FloatingActions.jsx';

import { weddingData } from './data/index.js';

function App() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const playPromiseRef = useRef(null);

  useEffect(() => {
    // Singleton pattern to ensure only ONE audio instance ever exists
    if (!window.__weddingAudio) {
      try {
        window.__weddingAudio = new Audio(weddingData.assets.music);
        window.__weddingAudio.loop = true;
        window.__weddingAudio.volume = 0.45;
      } catch {
        // Audio not available
      }
    }
    
    audioRef.current = window.__weddingAudio;
    const audio = audioRef.current;

    if (!audio) return;

    const pauseMusic = () => {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          audio.pause();
          setIsPlaying(false);
        }).catch(() => {});
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) pauseMusic();
    };

    const handlePageHide = () => {
      pauseMusic();
      audio.currentTime = 0;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
      // Do NOT destroy window.__weddingAudio here, just clean up listeners.
      // This prevents hot-reload ghosting completely.
    };
  }, []);

  const handleEnter = () => {
    setEntered(true);
    const audio = audioRef.current;
    if (audio) {
      const promise = audio.play();
      if (promise !== undefined) {
        playPromiseRef.current = promise;
        promise.then(() => {
          setIsPlaying(true);
          playPromiseRef.current = null;
        }).catch(() => {
          setIsPlaying(false);
          playPromiseRef.current = null;
        });
      }
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (!audio.paused) {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          audio.pause();
          setIsPlaying(false);
        }).catch(() => {});
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      const promise = audio.play();
      if (promise !== undefined) {
        playPromiseRef.current = promise;
        promise.then(() => {
          setIsPlaying(true);
          playPromiseRef.current = null;
        }).catch(() => {
          setIsPlaying(false);
          playPromiseRef.current = null;
        });
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-sage-pale)', overflowX: 'hidden' }}>
      {/* ── Envelope Opening (conditional) ── */}
      <AnimatePresence>
        {!entered && <OpeningEnvelopeScreen onEnter={handleEnter} />}
      </AnimatePresence>

      {/* ── Main Invitation (shown after entering) ── */}
      {entered && (
        <>
          <FloatingParticles />

          {/* Music toggle — visible only after entry */}
          <MusicButton isPlaying={isPlaying} toggleMusic={toggleMusic} visible={entered} />

          {/* Sections */}
          <main>
            <HeroSection />
            <SaveTheDate />
            <CountdownTimer />
            <CoupleSection />
            <PhotoStack />
            <EventDetails />
            <InvitationMessage />
            <VenueSection />
            <FamilySection />
            <Footer />
          </main>

          {/* Mobile floating action bar */}
          <FloatingActions />
        </>
      )}
    </div>
  );
}

export default App;
