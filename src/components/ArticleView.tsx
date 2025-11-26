import { Copy, Check, Download, Image, Sparkles, ChevronDown, ChevronUp, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GeneratedArticle } from '@/types/meeting';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ArticleViewProps {
  article: GeneratedArticle;
  onGenerateImage: () => void;
  isGeneratingImage?: boolean;
}

export const ArticleView = ({ article, onGenerateImage, isGeneratingImage }: ArticleViewProps) => {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const handleCopy = async () => {
    const hashtagText = article.hashtags?.length 
      ? `\n\n${article.hashtags.map(h => `#${h}`).join(', ')}`
      : '';
    const text = `${article.title}\n\n${article.summary}\n\n${article.sections.map(s => `${s.heading}\n${s.content}`).join('\n\n')}\n\nKey Takeaways:\n${article.takeaways.map(t => `• ${t}`).join('\n')}${hashtagText}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const hashtagText = article.hashtags?.length 
      ? `\n\n${article.hashtags.map(h => `#${h}`).join(', ')}`
      : '';
    const text = `${article.title}\n\n${article.summary}\n\n${article.sections.map(s => `${s.heading}\n${s.content}`).join('\n\n')}\n\nKey Takeaways:\n${article.takeaways.map(t => `• ${t}`).join('\n')}${hashtagText}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/\s+/g, '_').substring(0, 50)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl shadow-card border border-border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Generated Article</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{article.title}</h1>

          {/* Summary */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary mb-2">Summary</p>
            <p className="text-foreground leading-relaxed">{article.summary}</p>
          </div>

          {/* Sections - LinkedIn Style */}
          <div className="space-y-3">
            {article.sections.map((section, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <h2 className="font-semibold text-foreground text-left">{section.heading}</h2>
                  {expandedSections.has(index) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedSections.has(index) && (
                  <div className="p-4 animate-fade-in">
                    <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                      {section.content.split('\n\n').map((paragraph, pIndex) => {
                        if (paragraph.startsWith('> ')) {
                          // Blockquote styling
                          return (
                            <blockquote 
                              key={pIndex} 
                              className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground"
                            >
                              {paragraph.slice(2)}
                            </blockquote>
                          );
                        }
                        return <p key={pIndex} className="mb-4">{paragraph}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Takeaways */}
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
            <p className="text-sm font-medium text-accent mb-3">Key Takeaways</p>
            <ul className="space-y-2">
              {article.takeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hashtags */}
          {article.hashtags && article.hashtags.length > 0 && (
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Suggested Hashtags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.hashtags.map((hashtag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(`#${hashtag}`)}
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Click any hashtag to copy</p>
            </div>
          )}

          {/* Generated Image */}
          {article.generatedImage ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Generated Graphic</p>
              <img
                src={article.generatedImage}
                alt="Generated article graphic"
                className="w-full rounded-lg shadow-card"
              />
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onGenerateImage}
              disabled={isGeneratingImage}
              className="w-full gap-2"
            >
              {isGeneratingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4" />
                  Generate Article Graphic
                </>
              )}
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
