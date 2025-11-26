import { Copy, Check, Download, Image, Sparkles, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GeneratedArticle } from '@/types/meeting';
import { useState } from 'react';

interface ArticleViewProps {
  article: GeneratedArticle;
  onGenerateImage: () => void;
  isGeneratingImage?: boolean;
}

export const ArticleView = ({ article, onGenerateImage, isGeneratingImage }: ArticleViewProps) => {
  const [copied, setCopied] = useState(false);

  // Build the full article text for copy/export
  const buildArticleText = () => {
    const lines: string[] = [];
    
    // Title
    lines.push(article.title);
    lines.push('');
    
    // Session Overview
    lines.push('Session Overview');
    lines.push(article.summary);
    lines.push('');
    
    // Sub-topics
    article.sections.forEach(section => {
      lines.push(section.heading);
      lines.push(section.content);
      lines.push('');
    });
    
    // Final Takeaways
    lines.push('Final Takeaways');
    article.takeaways.forEach((takeaway, i) => {
      lines.push(`${i + 1}. ${takeaway}`);
    });
    lines.push('');
    
    // Hashtags
    if (article.hashtags && article.hashtags.length > 0) {
      lines.push(article.hashtags.map(h => `#${h}`).join(', '));
    }
    
    return lines.join('\n');
  };

  const handleCopy = async () => {
    const text = buildArticleText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const text = buildArticleText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/\s+/g, '_').substring(0, 50)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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

      {/* Unified Article Content - Single scrollable window */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Session Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>

          {/* Generated Graphic - Positioned at top for visual appeal */}
          {article.generatedImage ? (
            <div className="rounded-lg overflow-hidden shadow-card">
              <img
                src={article.generatedImage}
                alt="Session graphic"
                className="w-full h-auto"
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
                  Generating Graphic...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4" />
                  Generate Session Graphic
                </>
              )}
            </Button>
          )}

          {/* Session Overview */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary">Session Overview</h2>
            <p className="text-foreground leading-relaxed">{article.summary}</p>
          </div>

          {/* Sub-Topics - Displayed inline without dropdowns */}
          {article.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h2 className="text-lg font-semibold text-primary">{section.heading}</h2>
              <div className="text-foreground leading-relaxed">
                {section.content.split('\n\n').map((paragraph, pIndex) => {
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote 
                        key={pIndex} 
                        className="border-l-4 border-accent pl-4 my-4 italic text-muted-foreground"
                      >
                        {paragraph.slice(2)}
                      </blockquote>
                    );
                  }
                  return <p key={pIndex} className="mb-3">{paragraph}</p>;
                })}
              </div>
            </div>
          ))}

          {/* Final Takeaways */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">Final Takeaways</h2>
            <ul className="space-y-2">
              {article.takeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-sm flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hashtags - Comma separated at the end */}
          {article.hashtags && article.hashtags.length > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Hashtags</span>
              </div>
              <p className="text-primary text-sm">
                {article.hashtags.map(h => `#${h}`).join(', ')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click to copy individual hashtags
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {article.hashtags.map((hashtag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded hover:bg-primary/20 transition-colors cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(`#${hashtag}`)}
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
