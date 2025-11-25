import { Mic, FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-hero">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Record & Post</h1>
              <p className="text-xs text-muted-foreground">Meeting Transcription</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">AI Powered</span>
          </div>
        </div>
      </div>
    </header>
  );
};
