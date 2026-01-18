import { BarChart3, Clock, Target, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { AnalyticsData } from '@/types/agent';

interface AnalyticsPanelProps {
  analytics: AnalyticsData;
  learningWeights: Record<string, number>;
}

export function AnalyticsPanel({ analytics, learningWeights }: AnalyticsPanelProps) {
  const filterRate = analytics.totalEmailsProcessed > 0
    ? Math.round(((analytics.decisionsBreakdown.ignored + analytics.decisionsBreakdown.batched) / analytics.totalEmailsProcessed) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={BarChart3}
          title="Analyzed"
          value={analytics.totalEmailsProcessed.toString()}
          color="text-purple-400"
          index={0}
        />
        <MetricCard
          icon={Clock}
          title="Saved"
          value={`${analytics.timeSavedMinutes}m`}
          color="text-cyan-400"
          index={1}
        />
        <MetricCard
          icon={Target}
          title="Accuracy"
          value={`${Math.round(analytics.accuracy.precision * 100)}%`}
          color="text-pink-400"
          index={2}
        />
        <MetricCard
          icon={Zap}
          title="Filtered"
          value={`${filterRate}%`}
          color="text-amber-400"
          index={3}
        />
      </div>

      {/* Decision distribution & Learning weights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-2 border-b border-white/5 bg-white/[0.02]">
            <CardTitle className="text-sm font-display text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              Decision Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <DistributionBar
                label="Immediate"
                count={analytics.decisionsBreakdown.notifyImmediately}
                total={analytics.totalEmailsProcessed}
                color="bg-red-500"
              />
              <DistributionBar
                label="Delayed"
                count={analytics.decisionsBreakdown.delayed}
                total={analytics.totalEmailsProcessed}
                color="bg-yellow-500"
              />
              <DistributionBar
                label="Batched"
                count={analytics.decisionsBreakdown.batched}
                total={analytics.totalEmailsProcessed}
                color="bg-blue-500"
              />
              <DistributionBar
                label="Ignored"
                count={analytics.decisionsBreakdown.ignored}
                total={analytics.totalEmailsProcessed}
                color="bg-white/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-2 border-b border-white/5 bg-white/[0.02]">
            <CardTitle className="text-sm font-display text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              Reasoning Engine Weights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {Object.entries(learningWeights).map(([key, value], i) => (
                <motion.div 
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/40 capitalize font-mono">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-white/80">{(value * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${value * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" 
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/30 italic">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Dynamic adaptation active...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  color,
  index,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 mb-3 border border-white/5 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-2xl font-bold text-white font-display mb-1">{value}</p>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{title}</p>
      </div>
    </motion.div>
  );
}

function DistributionBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/60 font-medium">{label}</span>
        <span className="text-white/30 font-mono">{count}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}
