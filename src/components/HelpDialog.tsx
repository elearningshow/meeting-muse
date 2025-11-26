import { HelpCircle, Mail, Mic, FileText, Image, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          Help & Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Help & Feedback
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Overview */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">About Record & Post</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Record & Post is your AI-powered meeting assistant that transforms spoken conversations into polished articles. Simply record your meetings, and our AI will transcribe and generate professional content ready for sharing.
              </p>
            </section>

            <Separator />

            {/* How to Use */}
            <section>
              <h3 className="font-semibold text-foreground mb-3">How to Use</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mic className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">1. Start Recording</h4>
                    <p className="text-sm text-muted-foreground">
                      Press "Start Meeting" to begin recording. Press again to pause, or use the stop button to end the session.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">2. Generate Article</h4>
                    <p className="text-sm text-muted-foreground">
                      After stopping, customize the article style, tone, and length. The AI will create a professional article with hashtags.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Image className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">3. Add Graphics</h4>
                    <p className="text-sm text-muted-foreground">
                      Optionally generate an AI image to accompany your article for social media posts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">4. Ask Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the Q&A feature to ask questions about your meeting content and get AI-powered answers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Important Notes */}
            <section>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                Important Notes
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                  <span>
                    <strong className="text-foreground">Background Recording:</strong> Once recording starts, it remains active in the background until you press the "Stop Meeting" button. You can minimize the app and recording will continue.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Mic className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                  <span>
                    <strong className="text-foreground">Microphone Access:</strong> Ensure you've granted microphone permissions for transcription to work properly.
                  </span>
                </p>
              </div>
            </section>

            <Separator />

            {/* Contact */}
            <section>
              <h3 className="font-semibold text-foreground mb-3">Contact & Support</h3>
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">For questions, feedback, or support:</p>
                    <a 
                      href="mailto:admin@elearningshow.com" 
                      className="text-primary font-medium hover:underline"
                    >
                      admin@elearningshow.com
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                We value your feedback and aim to respond within 24-48 hours.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
