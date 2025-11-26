import { X, Clock, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Meeting } from '@/types/meeting';
import { cn } from '@/lib/utils';
import { SettingsDialog } from './SettingsDialog';
import { HelpDialog } from './HelpDialog';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: Meeting[];
  selectedMeetingId?: string;
  onSelectMeeting: (meeting: Meeting) => void;
  onNewMeeting: () => void;
}

export const Sidebar = ({
  isOpen,
  onClose,
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  onNewMeeting,
}: SidebarProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="font-semibold text-sidebar-foreground">Meetings</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            <Button
              onClick={onNewMeeting}
              className="w-full gradient-hero text-primary-foreground hover:opacity-90"
            >
              + New Meeting
            </Button>
          </div>

          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 py-2">
              {meetings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No meetings yet</p>
                </div>
              ) : (
                meetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => onSelectMeeting(meeting)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent group",
                      selectedMeetingId === meeting.id && "bg-sidebar-accent"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-sidebar-foreground truncate">
                          {meeting.title || 'Untitled Meeting'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{formatDate(meeting.createdAt)}</span>
                          <span>•</span>
                          <span>{formatDuration(meeting.duration)}</span>
                        </div>
                        {meeting.article && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <FileText className="h-3 w-3 text-accent" />
                            <span className="text-xs text-accent font-medium">Article generated</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-sidebar-border space-y-1">
            <SettingsDialog />
            <HelpDialog />
          </div>
        </div>
      </aside>
    </>
  );
};
