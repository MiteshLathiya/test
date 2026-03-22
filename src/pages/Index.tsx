import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import HeartCursorTrail from "@/components/HeartCursorTrail";
import BackgroundMusic from "@/components/BackgroundMusic";
import RomanticMessage from "@/components/RomanticMessage";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingScreen from "@/components/LoadingScreen";
import GiftBox from "@/components/GiftBox";
import LoveLetter from "@/components/LoveLetter";
import MemoryGallery from "@/components/MemoryGallery";
import HeartCatchGame from "@/components/HeartCatchGame";
import BirthdayCountdown from "@/components/BirthdayCountdown";
import FinalSurprise from "@/components/FinalSurprise";
import RelationshipDuration from "@/components/RelationshipDuration";

const steps = [
  "welcome",
  "duration",
  "gift",
  "letter",
  "gallery",
  "game",
  "countdown",
  "finale",
] as const;

type Step = (typeof steps)[number];

const TOTAL_MEMORIES = 4;

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<Step>("welcome");
  
  // Progress tracking states
  const [giftOpened, setGiftOpened] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Video state for reducing background music volume
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const goTo = (next: Step) => setStep(next);

  // Track gift completion
  const handleGiftComplete = useCallback(() => {
    setGiftOpened(true);
    goTo("duration");
  }, []);

  // Track duration display completion
  const handleDurationComplete = useCallback(() => {
    goTo("letter");
  }, []);

  // Track letter completion
  const handleLetterComplete = useCallback(() => {
    setLetterOpened(true);
    goTo("gallery");
  }, []);

  // Track game completion
  const handleGameComplete = useCallback(() => {
    setGameCompleted(true);
    goTo("countdown");
  }, []);

  // Finale is always unlocked now
  const isFinaleUnlocked = true;

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Loading Screen - shows first */}
      <LoadingScreen 
        onComplete={handleLoadingComplete}
        voiceMessageSrc="/assets/music/voice-message.mp3"
      />

      {/* Global Background Effects - only show after loading */}
      {!isLoading && (
        <>
          <FloatingHearts count={15} sparkles={true} />
          <HeartCursorTrail />
          <BackgroundMusic 
            src="/assets/music/happy-birthday.mp3"
            isFinale={step === "finale"}
            useAmbient={false}
            autoPlay={true}
            isReduced={isVideoPlaying}
            reducedVolume={0.2}
          />
          {/* Random romantic messages throughout the journey */}
          <RomanticMessage />
        </>
      )}

      <AnimatePresence mode="wait">
        {!isLoading && (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-10"
        >
          {step === "welcome" && <WelcomeScreen onStart={() => goTo("gift")} />}
          
          {step === "duration" && (
            <RelationshipDuration 
              onComplete={handleDurationComplete}
            />
          )}
          
          {step === "gift" && (
            <GiftBox 
              onComplete={handleGiftComplete}
              onVideoStart={() => setIsVideoPlaying(true)}
              onVideoEnd={() => setIsVideoPlaying(false)}
            />
          )}
          
          {step === "letter" && (
            <LoveLetter onComplete={handleLetterComplete} />
          )}
          
          {step === "gallery" && (
            <MemoryGallery
              onReveal={() => {}}
              onAllRevealed={() => {}}
              revealedCount={0}
              totalCount={TOTAL_MEMORIES}
              onComplete={() => goTo("game")}
            />
          )}
          
          {step === "game" && (
            <HeartCatchGame onComplete={handleGameComplete} />
          )}
          
          {step === "countdown" && (
            <BirthdayCountdown onComplete={() => goTo("finale")} />
          )}
          
          {step === "finale" && (
            <FinalSurprise isUnlocked={isFinaleUnlocked} />
          )}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
