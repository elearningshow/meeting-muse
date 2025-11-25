import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, X } from 'lucide-react';
import { ArticlePrompt } from '@/types/meeting';

interface ArticlePromptFormProps {
  prompt: ArticlePrompt;
  onPromptChange: (prompt: ArticlePrompt) => void;
  onGenerate: () => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const ArticlePromptForm = ({
  prompt,
  onPromptChange,
  onGenerate,
  onCancel,
  isGenerating,
}: ArticlePromptFormProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-elevated border border-border animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-foreground">Generate Article</h2>
              <p className="text-sm text-muted-foreground">Customize your article output</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Writing Style</Label>
              <Select
                value={prompt.style}
                onValueChange={(v) => onPromptChange({ ...prompt, style: v as ArticlePrompt['style'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select
                value={prompt.tone}
                onValueChange={(v) => onPromptChange({ ...prompt, tone: v as ArticlePrompt['tone'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Article Length</Label>
            <Select
              value={prompt.length}
              onValueChange={(v) => onPromptChange({ ...prompt, length: v as ArticlePrompt['length'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (~300 words)</SelectItem>
                <SelectItem value="medium">Medium (~600 words)</SelectItem>
                <SelectItem value="long">Long (~1000 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Input
              value={prompt.audience}
              onChange={(e) => onPromptChange({ ...prompt, audience: e.target.value })}
              placeholder="e.g., Team members, Executives, Clients"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
            Cancel
          </Button>
          <Button variant="default" onClick={onGenerate} disabled={isGenerating} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Article
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
