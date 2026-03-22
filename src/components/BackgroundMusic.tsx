import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbientLoop } from "../hooks/useSounds";

interface BackgroundMusicProps {
  src?: string;
  romanticSrc?: string;
  isFinale?: boolean;
  useAmbient?: boolean;
  autoPlay?: boolean;
  volume?: number; // 0-1, default 1
  reducedVolume?: number; // Volume when video/content is playing, default 0.3
  isReduced?: boolean; // When true, volume is reduced (for video playback)
}

const BackgroundMusic = ({ 
  src, 
  romanticSrc, 
  isFinale, 
  useAmbient = false, 
  autoPlay = true,
  volume: initialVolume = 0.5,
  reducedVolume = 0.3,
  isReduced = false
}: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const audioRef = useRef<HTMLAudioElement>(null);
  const finaleAudioRef = useRef<HTMLAudioElement>(null);

  // Use our programmatic ambient sound if enabled (or autoPlay is true)
  const playAmbient = useAmbientLoop();
  
  // Store cleanup function for ambient
  const ambientCleanupRef = useRef<(() => void) | null>(null);

  // Auto-play on first user interaction (required by browsers for audio files)
  // But programmatic ambient can start immediately if autoPlay is enabled
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      
      // If useAmbient is true, use programmatic ambient sound (works without user interaction)
      // Otherwise use audio files which need user interaction first
      if (useAmbient) {
        // Use programmatic ambient sound (sound #16) - works without user interaction!
        ambientCleanupRef.current = playAmbient();
      } else {
        // Use audio files - ensure it's loaded first
        if (audioRef.current && audioRef.current.readyState >= 2) {
          console.log("Playing audio:", audioRef.current.src);
          audioRef.current.play().catch((err) => {
            console.error("Audio play error:", err);
          });
        } else if (audioRef.current) {
          // Wait for canplay event
          audioRef.current.addEventListener('canplay', () => {
            audioRef.current?.play().catch((err) => {
              console.error("Audio play error:", err);
            });
          }, { once: true });
        }
      }
      setIsPlaying(true);
    }
  }, [hasInteracted, useAmbient, playAmbient]);

  // Listen for first interaction
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
      // Cleanup ambient sound on unmount
      if (ambientCleanupRef.current) {
        ambientCleanupRef.current();
      }
    };
  }, [handleFirstInteraction]);

  // Try to autoplay audio file immediately on mount (when not using ambient)
  // Note: Most browsers will block this without user interaction, but we try anyway
  // The user interaction listener will handle the case where autoplay is blocked
  useEffect(() => {
    if (!useAmbient && autoPlay && audioRef.current) {
      // Try to play immediately - may fail due to browser autoplay policy
      audioRef.current.play()
        .then(() => {
          console.log("Autoplay started successfully");
          setIsPlaying(true);
          setHasInteracted(true); // Mark as interacted so we don't play again
        })
        .catch((err) => {
          console.log("Autoplay blocked, will play on first interaction:", err.message);
          // This is expected - browser blocked autoplay
          // The first interaction listener will handle playback
        });
    }
  }, [useAmbient, autoPlay]);

  // Control volume based on isReduced state and user volume setting
  useEffect(() => {
    if (audioRef.current) {
      // When video is playing (isReduced), use reduced volume percentage of user volume
      // Otherwise use full user volume
      const userVolume = volume;
      const targetVolume = isReduced ? userVolume * reducedVolume : userVolume;
      audioRef.current.volume = Math.max(0, Math.min(1, targetVolume));
    }
  }, [isReduced, volume, reducedVolume]);

  // Handle volume change from slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMusic = () => {
    if (useAmbient) {
      // Handle programmatic ambient sound
      if (isPlaying && ambientCleanupRef.current) {
        ambientCleanupRef.current();
        ambientCleanupRef.current = null;
      } else if (!isPlaying) {
        ambientCleanupRef.current = playAmbient();
      }
    } else {
      // Handle audio file
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Play romantic music during finale (if available)
  useEffect(() => {
    if (isFinale) {
      if (romanticSrc && finaleAudioRef.current) {
        // Fade out birthday music and play romantic music
        if (audioRef.current) {
          audioRef.current.pause();
        }
        finaleAudioRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        // Continue playing birthday music if no romantic track
        if (audioRef.current && !isPlaying) {
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }
  }, [isFinale, romanticSrc, isPlaying]);

  return (
    <>
      <audio 
        ref={audioRef} 
        src={src || "/assets/music/happy-birthday.mp3"} 
        loop 
        onError={(e) => console.error("Audio load error:", e)}
      />
      <audio ref={finaleAudioRef} src={romanticSrc || "/assets/music/romantic.mp3"} loop />
      
      {/* Floating Music Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isPlaying
            ? ["0 0 20px hsl(340 60% 65% / 0.4)", "0 0 40px hsl(340 60% 65% / 0.6)", "0 0 20px hsl(340 60% 65% / 0.4)"]
            : "0 0 10px hsl(340 60% 65% / 0.2)",
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
        }}
      >
        <motion.span
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          🎵
        </motion.span>
      </motion.button>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 bg-background rounded-2xl p-4 shadow-xl border border-primary/20"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="font-body text-sm text-muted-foreground">
                Birthday Melody
              </span>
              <motion.button
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl"
                onClick={toggleMusic}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </motion.button>
              {isPlaying && (
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: [10, 20, 15, 25, 10],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              )}
              
              {/* Volume Slider */}
              <div className="flex items-center gap-2 w-full mt-2">
                <span className="text-xs text-muted-foreground">🔈</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xs text-muted-foreground">🔊</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackgroundMusic;