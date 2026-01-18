import { useState, useEffect } from 'react';
import { AgentStatusBar } from '@/components/dashboard/AgentStatusBar';
import { PriorityInbox } from '@/components/dashboard/PriorityInbox';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { AnalyticsPanel } from '@/components/dashboard/AnalyticsPanel';
import { GoalsPanel } from '@/components/dashboard/GoalsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, BarChart3, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Email, EmailAnalysis, UserFeedback, Goal } from '@/types/agent';
import { useAgent } from '@/contexts/AgentContext';

interface DashboardPageProps {
  user: {
    name: string;
    picture?: string;
    goals: Goal[];
  };
  emails: Email[];
  analyzedEmails: Map<string, EmailAnalysis>;
  isProcessing: boolean;
  focusMode: boolean;
  isConnected: boolean;
  onProcessAll: () => void;
  onFeedback: (feedback: UserFeedback) => void;
  onToggleFocusMode: () => void;
  onDisconnect: () => void;
  onBackToLanding: () => void;
  onAddGoal: (goal: any) => void;
  onRemoveGoal: (goalId: string) => void;
  addPriorityRule: (rule: { type: 'sender' | 'keyword'; value: string }) => void;
  getAnalytics: () => any;
  getLearningWeights: () => any;
}

export function DashboardPage(props: DashboardPageProps) {
  const {
    user,
    emails,
    analyzedEmails,
    isConnected,
    isProcessing,
    focusMode,
    onProcessAll,
    onFeedback,
    onToggleFocusMode,
    onDisconnect,
    onBackToLanding,
    onAddGoal,
    onRemoveGoal,
    getAnalytics,
    getLearningWeights,
    addPriorityRule,
  } = props;

  const [selectedEmail, setSelectedEmail] = useState<{ email: Email; analysis?: EmailAnalysis } | null>(null);

  // Auto-process emails when they load
  useEffect(() => {
    if (emails.length > 0 && analyzedEmails.size === 0 && !isProcessing && isConnected) {
      onProcessAll();
    }
  }, [emails.length, isConnected]);

  const handleEmailClick = (email: Email, analysis?: EmailAnalysis) => {
    setSelectedEmail({ email, analysis });
  };

  const handleCloseDecisionCard = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/30">
      <AgentStatusBar
        userName={user.name}
        userPicture={user.picture}
        focusMode={focusMode}
        isConnected={isConnected}
        onToggleFocusMode={onToggleFocusMode}
        onDisconnect={onDisconnect}
        onBackToLanding={onBackToLanding}
      />

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
        {/* Mobile/Tablet Tabs Layout */}
        <div className="xl:hidden">
          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 w-full grid grid-cols-3 h-12 rounded-2xl">
              <TabsTrigger value="inbox" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 transition-all font-bold text-xs uppercase tracking-widest">
                <Mail className="h-3.5 w-3.5 mr-2" />
                Signals
              </TabsTrigger>
              <TabsTrigger value="focus" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 transition-all font-bold text-xs uppercase tracking-widest">
                <Target className="h-3.5 w-3.5 mr-2" />
                Focus
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 transition-all font-bold text-xs uppercase tracking-widest">
                <BarChart3 className="h-3.5 w-3.5 mr-2" />
                Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="mt-4">
              <PriorityInbox
                emails={emails}
                analyzedEmails={analyzedEmails}
                isProcessing={isProcessing}
                onProcessAll={onProcessAll}
                onEmailClick={handleEmailClick}
                onFeedback={onFeedback}
                onAddRule={addPriorityRule}
              />
            </TabsContent>

            <TabsContent value="focus" className="mt-4">
              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {selectedEmail ? (
                    <motion.div
                      key="decision"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                    >
                      <DecisionCard
                        email={selectedEmail.email}
                        analysis={selectedEmail.analysis}
                        onClose={handleCloseDecisionCard}
                        onFeedback={onFeedback}
                      />
                    </motion.div>
                  ) : (
                    <GoalsPanel
                      goals={user.goals}
                      onAddGoal={onAddGoal}
                      onRemoveGoal={onRemoveGoal}
                    />
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <AnalyticsPanel
                analytics={getAnalytics()}
                learningWeights={getLearningWeights()}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Large Desktop Layout - Responsive Grid */}
        <div className="hidden xl:flex flex-col gap-6 lg:gap-8">
          {/* Top Row: Inbox & Focus/Decision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[500px] xl:h-[600px]">
            {/* Inbox (Signals) */}
            <div className="h-full min-h-[400px]">
              <PriorityInbox
                emails={emails}
                analyzedEmails={analyzedEmails}
                isProcessing={isProcessing}
                onProcessAll={onProcessAll}
                onEmailClick={handleEmailClick}
                onFeedback={onFeedback}
                onAddRule={addPriorityRule}
              />
            </div>

            {/* Focus/Decision (Middle) */}
            <div className="h-full min-h-[400px]">
              <AnimatePresence mode="wait">
                {selectedEmail ? (
                  <motion.div
                    key="decision"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    <DecisionCard
                      email={selectedEmail.email}
                      analysis={selectedEmail.analysis}
                      onClose={handleCloseDecisionCard}
                      onFeedback={onFeedback}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="goals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    <GoalsPanel
                      goals={user.goals}
                      onAddGoal={onAddGoal}
                      onRemoveGoal={onRemoveGoal}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Row: Analytics (Insights) */}
          <div className="w-full">
            <AnalyticsPanel
              analytics={getAnalytics()}
              learningWeights={getLearningWeights()}
            />
          </div>
        </div>

        {/* Decision Overlay for non-XL when email is selected but not in focus tab */}
        {selectedEmail && (
          <div className="xl:hidden fixed inset-0 z-50 pointer-events-none">
            {/* Logic handles it via focus tab, but this overlay could be used for 'Quick View' */}
          </div>
        )}
      </main>
    </div>
  );
}
