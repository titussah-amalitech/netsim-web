import { useState } from 'react';
import { Button } from '../../../components';
import { X, Zap, Activity, Clock, Trophy } from 'lucide-react';

const onboardingSteps = [
  {
    title: "Welcome to Network Simulation",
    description: "Master the art of network troubleshooting in a gamified environment. Fix issues, earn points, and compete on the leaderboard!",
    icon: <Zap className="w-20 h-20 text-network-accent" strokeWidth={1.5} />
  },
  {
    title: "Monitor Device Status",
    description: "Keep an eye on your network devices. Green means healthy, Yellow indicates high latency, and Red signals an offline device.",
    icon: <Activity className="w-20 h-20 text-network-accent" strokeWidth={1.5} />
  },
  {
    title: "Fix Issues Fast",
    description: "Click on problematic devices to adjust their parameters. Faster fixes earn more points! Reduce latency, adjust ping intervals, and minimize failure probability.",
    icon: <Clock className="w-20 h-20 text-network-accent" strokeWidth={1.5} />
  },
  {
    title: "Earn Points & Compete",
    description: "Score points based on response time. The faster you resolve issues, the higher your score. Compete with others on the leaderboard!",
    icon: <Trophy className="w-20 h-20 text-network-accent" strokeWidth={1.5} />
  }
];

export const GameOnboardingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  const current = onboardingSteps[step];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-network-surface border-2 border-network-border-light dark:border-network-border rounded-lg max-w-2xl w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-network-text-dark dark:text-network-text hover:text-network-text-darker dark:hover:text-network-text-light transition-colors p-1 rounded hover:bg-network-border-light dark:hover:bg-network-border"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            {current.icon}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-network-text-darker dark:text-network-lighter">
            {current.title}
          </h3>
          <p className="text-base sm:text-lg text-network-text-dark dark:text-network-text mb-10 leading-relaxed px-4">
            {current.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-10">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === step
                    ? 'bg-network-accent w-10'
                    : 'bg-network-border-light dark:bg-network-border w-2'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-center">
            {step > 0 && (
              <Button onClick={handlePrev} variant="secondary" size="large">
                Previous
              </Button>
            )}
            <Button onClick={handleNext} variant="accent" size="large" className="font-bold">
              {step === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};