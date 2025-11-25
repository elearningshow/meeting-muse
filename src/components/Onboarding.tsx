import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, FileText, Sparkles, Image, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Mic,
    title: 'Record Your Meetings',
    description: 'Simply click "Start Meeting" to begin recording. Your voice will be transcribed in real-time as you speak.',
    color: 'primary',
  },
  {
    icon: FileText,
    title: 'Live Transcription',
    description: 'Watch as your words appear on screen instantly. The transcript is saved automatically for later reference.',
    color: 'primary',
  },
  {
    icon: Sparkles,
    title: 'AI Article Generation',
    description: 'Transform your meeting transcript into a polished article. Customize the style, tone, and length to match your needs.',
    color: 'accent',
  },
  {
    icon: Image,
    title: 'Generate Graphics',
    description: 'Create stunning visuals to accompany your article. Perfect for presentations and social media sharing.',
    color: 'accent',
  },
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentStep 
                  ? "w-8 gradient-hero" 
                  : index < currentStep 
                    ? "w-2 bg-primary" 
                    : "w-2 bg-muted"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center animate-fade-in" key={currentStep}>
          <div className={cn(
            "w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center",
            step.color === 'accent' ? 'gradient-accent' : 'gradient-primary'
          )}>
            <Icon className="h-12 w-12 text-primary-foreground" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">{step.title}</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">{step.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            variant="default"
            onClick={handleNext}
            className="gap-2"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Skip */}
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
