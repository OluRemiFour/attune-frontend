import { useState, useEffect } from 'react';
import { ChevronRight, Mail, BarChart3, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

const mockInboxEmails = [
  {
    sender: 'CEO John Smith',
    subject: 'URGENT: Q1 Strategy Meeting Tomorrow',
    score: 92,
    decision: 'notify_immediately',
    reasoning: 'VIP sender • Matches active goal • Action required',
    time: '30m ago',
  },
  {
    sender: 'Sarah Manager',
    subject: 'Re: Project Update Needed',
    score: 85,
    decision: 'notify_immediately',
    reasoning: 'VIP sender • Deadline mentioned • Goal relevant',
    time: '45m ago',
  },
  {
    sender: 'Coursera',
    subject: 'Your ML Course: New Module Available',
    score: 48,
    decision: 'batch_notification',
    reasoning: 'Matches "Learn ML" goal • No urgency',
    time: '1h ago',
  },
  {
    sender: 'Alex Teammate',
    subject: 'Quick question about the API',
    score: 55,
    decision: 'delay_notification',
    reasoning: 'Focus mode active • Can wait',
    time: '20m ago',
  },
  {
    sender: 'Newsletter Bot',
    subject: 'Weekly Tech Digest: AI News',
    score: 18,
    decision: 'ignore',
    reasoning: 'No goal relevance • Low engagement history',
    time: '2h ago',
  },
];

const decisionColors: Record<string, { bg: string; text: string; label: string }> = {
  notify_immediately: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Immediate' },
  delay_notification: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Delayed' },
  batch_notification: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Batched' },
  ignore: { bg: 'bg-white/5', text: 'text-white/40', label: 'Ignored' },
};

const mockAnalytics = {
  processed: 127,
  timeSaved: 45,
  accuracy: 87,
  breakdown: {
    immediate: 12,
    delayed: 28,
    batched: 34,
    ignored: 53,
  },
};

function AnimatedScore({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

export function DemoPreviewSection() {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <section className="py-24 relative overflow-hidden" id="demo">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            See It In Action
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/60"
          >
            A glimpse into how Attune prioritizes your inbox and saves your time.
          </motion.p>
        </div>

        <div className="mx-auto max-w-5xl">
          <Card className="shadow-2xl border-white/10 overflow-hidden bg-white/[0.03] backdrop-blur-xl">
            <CardHeader className="bg-slate-900 border-b border-white/5 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center pulse-glow">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Attune</CardTitle>
                    <p className="text-xs text-white/40 font-mono">Autonomous Reasoner</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Active</span>
                </div>
              </div>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-white/5 bg-white/[0.02] px-6">
                <TabsList className="bg-transparent h-14 gap-4">
                  <TabsTrigger
                    value="inbox"
                    className="data-[state=active]:bg-white/5 data-[state=active]:text-white text-white/40 rounded-t-lg px-4 py-2 transition-all font-medium"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Priority Inbox
                  </TabsTrigger>
                  <TabsTrigger
                    value="decision"
                    className="data-[state=active]:bg-white/5 data-[state=active]:text-white text-white/40 rounded-t-lg px-4 py-2 transition-all font-medium"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Decision Card
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:bg-white/5 data-[state=active]:text-white text-white/40 rounded-t-lg px-4 py-2 transition-all font-medium"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-0 min-h-[500px] overflow-hidden bg-white/[0.01]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <TabsContent value="inbox" className="m-0" forceMount>
                      {activeTab === 'inbox' && (
                        <div className="divide-y divide-white/5">
                          {mockInboxEmails.map((email, index) => {
                            const decision = decisionColors[email.decision];
                            const scoreColor = email.score >= 70 ? 'text-red-500 bg-red-500/10 border-red-500/20' :
                              email.score >= 40 ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : 'text-white/40 bg-white/5 border-white/10';

                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-start gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${email.decision === 'ignore' ? 'opacity-40' : ''}`}
                              >
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${scoreColor} border flex items-center justify-center`}>
                                  <span className="font-bold text-sm">
                                    <AnimatedScore value={email.score} />
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-white">{email.sender}</span>
                                    <Badge variant="secondary" className={`${decision.bg} ${decision.text} border border-white/5 text-[10px]`}>
                                      {decision.label}
                                    </Badge>
                                    <span className="text-xs text-white/30 ml-auto font-mono">{email.time}</span>
                                  </div>
                                  <p className="text-white/80 text-sm mt-0.5 truncate font-medium">
                                    {email.subject}
                                  </p>
                                  <p className="text-white/40 text-[11px] mt-1 flex items-center gap-1.5">
                                    <Zap className="h-3 w-3" />
                                    {email.reasoning}
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-white/20 flex-shrink-0" />
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="decision" className="m-0 p-8" forceMount>
                      {activeTab === 'decision' && (
                        <div className="max-w-2xl mx-auto">
                          <motion.div 
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", damping: 25, stiffness: 120 }}
                            className="bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl"
                          >
                            <div className="flex items-start gap-6">
                              <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-red-500 text-xl font-bold">
                                  <AnimatedScore value={92} />
                                </span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-white font-display leading-tight">
                                  URGENT: Q1 Strategy Meeting Tomorrow
                                </h3>
                                <p className="text-white/40 text-sm mt-1">From: CEO John Smith</p>
                              </div>
                            </div>

                            <div className="mt-10 space-y-8">
                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-3">Agent Decision</h4>
                                <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs py-1.5 px-4 rounded-full">
                                  Notify Immediately
                                </Badge>
                              </div>

                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-3">Reasoning Inference</h4>
                                <div className="bg-white/5 rounded-2xl p-6 text-sm text-white/70 leading-relaxed border border-white/10 font-medium">
                                  <p>
                                    "Critical signal detected (92/100). VIP sender classification (CEO) 
                                    matched with active goal 'Execute Q1 Vision'. High semantic overlap with 
                                    strategic priorities. Recommending priority breakthrough."
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-4">Neural Scoring Metrics</h4>
                                <div className="space-y-4">
                                  {[
                                    { label: 'Signal Importance', score: 95, color: 'from-red-500 to-orange-500' },
                                    { label: 'Contextual Relevance', score: 88, color: 'from-purple-500 to-pink-500' },
                                    { label: 'Urgency Classification', score: 80, color: 'from-blue-500 to-cyan-500' },
                                  ].map((factor) => (
                                    <div key={factor.label}>
                                      <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="text-white/40 font-medium">{factor.label}</span>
                                        <span className="text-white font-bold font-mono">{factor.score}%</span>
                                      </div>
                                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${factor.score}%` }}
                                          transition={{ duration: 1, delay: 0.5 }}
                                          className={`h-full bg-gradient-to-r ${factor.color} rounded-full`}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="analytics" className="m-0 p-8" forceMount>
                      {activeTab === 'analytics' && (
                        <div className="relative rounded-3xl p-8 border border-white/10 bg-white/[0.02] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 -z-10" />
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                              { label: 'Processed', value: mockAnalytics.processed, color: 'text-purple-400' },
                              { label: 'Time Saved', value: `${mockAnalytics.timeSaved}m`, color: 'text-cyan-400' },
                              { label: 'Accuracy', value: `${mockAnalytics.accuracy}%`, color: 'text-pink-400' },
                              { label: 'Filtered', value: '68%', color: 'text-amber-400' },
                            ].map((item, i) => (
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm group hover:bg-white/[0.08] transition-all"
                              >
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.label}</p>
                                <p className="text-3xl font-bold text-white mt-2 font-display">{item.value}</p>
                              </motion.div>
                            ))}
                          </div>

                          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/10">
                            <h4 className="text-sm font-bold text-white mb-8 font-display uppercase tracking-widest opacity-40">Decision Distribution</h4>
                            <div className="space-y-8">
                              {[
                                { label: 'Immediate Breakthrough', count: 12, color: 'bg-red-500' },
                                { label: 'Delayed Notifications', count: 28, color: 'bg-yellow-500' },
                                { label: 'Smart Batches', count: 34, color: 'bg-blue-500' },
                                { label: 'Silent Archival', count: 53, color: 'bg-white/20' },
                              ].map((item) => (
                                <div key={item.label}>
                                  <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-white/60 font-medium">{item.label}</span>
                                    <span className="text-white/30 font-mono italic">{item.count} items</span>
                                  </div>
                                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(item.count / 127) * 100}%` }}
                                      transition={{ duration: 1.5, ease: "circOut" }}
                                      className={`h-full ${item.color} rounded-full`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
}
