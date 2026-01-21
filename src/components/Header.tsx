import logoImg from '@/assets/logo.jpg';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-card">
              <img src={logoImg} alt="Record & Post" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Record & Post</h1>
              <p className="text-xs text-muted-foreground">Session Transcription</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${hasApiKey ? 'bg-green-500/10 border-green-500/30' : 'bg-secondary border-border'}`}>
            <Sparkles className={`h-4 w-4 ${hasApiKey ? 'text-green-500' : 'text-primary'}`} />
            <span className="text-sm font-medium text-secondary-foreground hidden sm:inline">
              {hasApiKey ? 'Gemini Flash' : 'AI Ready'}
            </span>
            <span className="text-sm font-medium text-secondary-foreground sm:hidden">
              {hasApiKey ? 'AI' : '–'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
