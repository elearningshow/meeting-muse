import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, FileSignature } from 'lucide-react';

interface MeetingFormProps {
  title: string;
  participants: string;
  date: string;
  onTitleChange: (value: string) => void;
  onParticipantsChange: (value: string) => void;
  onDateChange: (value: string) => void;
  disabled?: boolean;
}

export const MeetingForm = ({
  title,
  participants,
  date,
  onTitleChange,
  onParticipantsChange,
  onDateChange,
  disabled,
}: MeetingFormProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3 p-4 sm:p-6 bg-card rounded-xl shadow-card border border-border animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
          <FileSignature className="h-4 w-4 text-primary" />
          Session Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Insert Session Title"
          disabled={disabled}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="participants" className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-primary" />
          Participants
        </Label>
        <Input
          id="participants"
          value={participants}
          onChange={(e) => onParticipantsChange(e.target.value)}
          placeholder="John, Sarah, Mike"
          disabled={disabled}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-primary" />
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={disabled}
          className="bg-background"
        />
      </div>
    </div>
  );
};
