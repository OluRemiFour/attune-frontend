import { Zap, X, Check, ChevronDown, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Email, EmailAnalysis, AgentDecision, UserFeedback } from '@/types/agent';

interface DecisionCardProps {
  email: Email;
  analysis: EmailAnalysis;
  onClose: () => void;
  onFeedback: (feedback: UserFeedback) => void;
}

const decisionConfig: Record<AgentDecision, { bg: string; text: string; label: string; border: string }> = {
  notify_immediately: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/20',
    label: 'Notify Immediately',
  },
  delay_notification: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    border: 'border-yellow-500/20',
    label: 'Delay Notification',
  },
  batch_notification: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
    label: 'Batch Notification',
  },
  ignore: {
    bg: 'bg-white/5',
    text: 'text-white/40',
    border: 'border-white/10',
    label: 'Ignore Signal',
  },
};

export function DecisionCard({ email, analysis, onClose, onFeedback }: DecisionCardProps) {
  const decision = decisionConfig[analysis.decision];
  const scoreColor = analysis.priorityScore >= 70 ? 'bg-red-500/10 text-red-500 border-red-500/20' :
    analysis.priorityScore >= 40 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
    'bg-white/5 text-white/40 border-white/10';

  const handleFeedback = (action: UserFeedback['action'], reclassifiedTo?: AgentDecision) => {
    onFeedback({
      emailId: email.id,
      action,
      reclassifiedTo,
      timestamp: new Date(),
    });
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="shadow-2xl border-white/10 overflow-hidden bg-white/[0.03] backdrop-blur-3xl rounded-3xl">
      <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border border-white/10 pulse-glow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-white tracking-tight">Neural Analysis</CardTitle>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Decision Matrix</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/5 text-white/30 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8 scrollbar-hide">
        {/* Email Context */}
        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
          <div className={`h-12 w-12 rounded-full ${scoreColor} border flex items-center justify-center flex-shrink-0 font-bold font-mono text-lg shadow-sm`}>
            {analysis.priorityScore}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-base tracking-tight">{email.subject}</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <Mail className="h-3.5 w-3.5 text-white/30" />
                <span className="truncate max-w-[150px]">{email.sender.name || email.sender.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-mono italic">
                <Clock className="h-3 w-3" />
                <span>{getTimeAgo(email.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inference Badge */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30">Inference</h4>
            <Badge className={`${decision.bg} ${decision.text} border ${decision.border} text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider`}>
              {decision.label}
            </Badge>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30">Confidence</h4>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${analysis.confidenceScore}%` }} />
              </div>
              <span className="text-[10px] font-mono text-white/60">{analysis.confidenceScore}%</span>
            </div>
          </div>
        </div>

        {/* Neural Reasoning */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30">Reasoning Chain</h4>
          <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5">
            <p className="text-sm text-white/70 leading-relaxed font-medium italic">
              "{analysis.reasoning}"
            </p>
          </div>
        </div>

        {/* Neural Parameters */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30">Neural Parameters</h4>
          <div className="grid gap-4">
            <ScoreFactor
              label="Sender Rank"
              score={analysis.factors.senderImportance.score}
              reason={analysis.factors.senderImportance.reason}
              color="from-purple-500 to-indigo-500"
            />
            <ScoreFactor
              label="Semantic Relevance"
              score={analysis.factors.contentRelevance.score}
              reason={analysis.factors.contentRelevance.reason}
              color="from-cyan-500 to-blue-500"
            />
            <ScoreFactor
              label="Actionability"
              score={analysis.factors.actionRequired.score}
              reason={analysis.factors.actionRequired.reason}
              color="from-pink-500 to-rose-500"
            />
          </div>
        </div>

        {/* Feedback Loop */}
        <div className="pt-6 border-t border-white/5">
          <h4 className="text-xs font-bold text-white/40 mb-4 tracking-tight">Reinforcement Feedback</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-green-500/5 border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-400 h-10 rounded-xl text-xs font-bold"
              onClick={() => handleFeedback('opened')}
            >
              <Check className="h-4 w-4 mr-2" />
              Accurate
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 h-10 rounded-xl text-xs font-bold"
              onClick={() => handleFeedback('dismissed')}
            >
              <X className="h-4 w-4 mr-2" />
              Inaccurate
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 h-10 rounded-xl text-xs">
                  Adjust Rank
                  <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white">
                <DropdownMenuItem onClick={() => handleFeedback('reclassified', 'notify_immediately')} className="hover:bg-white/5 focus:bg-white/5">Immediate Breakthrough</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFeedback('reclassified', 'delay_notification')} className="hover:bg-white/5 focus:bg-white/5">Delayed Notification</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFeedback('reclassified', 'batch_notification')} className="hover:bg-white/5 focus:bg-white/5">Batched Process</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFeedback('reclassified', 'ignore')} className="hover:bg-white/5 focus:bg-white/5">Silent Archival</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreFactor({ label, score, reason, color }: { label: string; score: number; reason: string; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-white/40 uppercase tracking-widest">{label}</span>
        <span className="text-white font-mono">{score}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-[10px] text-white/30 italic font-medium">{reason}</p>
    </div>
  );
}
