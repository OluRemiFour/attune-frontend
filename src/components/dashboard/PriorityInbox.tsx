import { PriorityRuleDialog } from './PriorityRuleDialog';
import type { Email, EmailAnalysis, AgentDecision, UserFeedback } from '@/types/agent';

interface PriorityInboxProps {
  emails: Email[];
  analyzedEmails: Map<string, EmailAnalysis>;
  isProcessing: boolean;
  onProcessAll: () => void;
  onEmailClick: (email: Email, analysis?: EmailAnalysis) => void;
  onFeedback: (feedback: UserFeedback) => void;
  onAddRule: (rule: { type: 'sender' | 'keyword'; value: string }) => void;
}

const decisionConfig: Record<AgentDecision, { bg: string; text: string; label: string; description: string; border: string }> = {
  notify_immediately: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/20',
    label: 'Immediate',
    description: 'High priority - notify now',
  },
  delay_notification: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    border: 'border-yellow-500/20',
    label: 'Delayed',
    description: 'Will notify after focus mode',
  },
  batch_notification: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
    label: 'Batched',
    description: 'Included in next batch',
  },
  ignore: {
    bg: 'bg-white/5',
    text: 'text-white/40',
    border: 'border-white/10',
    label: 'Ignored',
    description: 'No notification needed',
  },
};

import { useState } from 'react';
import { Mail, Zap, Check, RefreshCw, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PriorityInbox({
  emails,
  analyzedEmails,
  isProcessing,
  onProcessAll,
  onEmailClick,
  onFeedback,
  onAddRule,
}: PriorityInboxProps) {
  const [filter, setFilter] = useState<AgentDecision | 'all'>('all');
  const [ruleDialog, setRuleDialog] = useState<{ isOpen: boolean; type: 'sender' | 'keyword' }>({
    isOpen: false,
    type: 'sender',
  });

  // Sort emails by priority score (descending)
  const sortedEmails = [...emails].sort((a, b) => {
    const analysisA = analyzedEmails.get(a.id);
    const analysisB = analyzedEmails.get(b.id);
    return (analysisB?.priorityScore || 0) - (analysisA?.priorityScore || 0);
  });

  // Filter emails
  const filteredEmails = filter === 'all'
    ? sortedEmails
    : sortedEmails.filter(e => analyzedEmails.get(e.id)?.decision === filter);

  const handleFeedback = (emailId: string, action: UserFeedback['action']) => {
    onFeedback({
      emailId,
      action,
      timestamp: new Date(),
    });
  };

  const handleReclassify = (emailId: string, newDecision: AgentDecision) => {
    onFeedback({
      emailId,
      action: 'reclassified',
      reclassifiedTo: newDecision,
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
    <>
      <Card className="h-full flex flex-col bg-white/[0.03] border-white/10 backdrop-blur-xl overflow-hidden rounded-3xl">
        <CardHeader className="flex-shrink-0 pb-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Mail className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white tracking-tight">Priority Inbox</CardTitle>
                <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">{emails.length} signals</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-white/40 hover:text-white hover:bg-white/5 border border-white/5">
                    <Filter className="h-3 w-3 mr-2" />
                    {filter === 'all' ? 'All Signals' : decisionConfig[filter].label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white">
                  <DropdownMenuItem onClick={() => setFilter('all')} className="hover:bg-white/5 focus:bg-white/5">All Signals</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('notify_immediately')} className="hover:bg-white/5 focus:bg-white/5">Immediate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('delay_notification')} className="hover:bg-white/5 focus:bg-white/5">Delayed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('batch_notification')} className="hover:bg-white/5 focus:bg-white/5">Batched</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('ignore')} className="hover:bg-white/5 focus:bg-white/5">Ignored</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8 text-xs bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 shadow-none">
                    <Zap className="h-3 w-3 mr-2" />
                    Priority Rules
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10 text-white">
                  <DropdownMenuItem 
                    onClick={() => setRuleDialog({ isOpen: true, type: 'sender' })}
                    className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <Check className="h-3 w-3 mr-2 text-green-500" />
                    Add Priority Sender
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setRuleDialog({ isOpen: true, type: 'keyword' })}
                    className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    <Filter className="h-3 w-3 mr-2 text-blue-500" />
                    Add Priority Keyword
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="secondary"
                size="sm"
                onClick={onProcessAll}
                disabled={isProcessing || emails.length === 0}
                className="h-8 text-xs bg-white/5 text-white/80 hover:bg-white/10 border-none shadow-none"
              >
                <RefreshCw className={`h-3 w-3 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? 'Syncing...' : 'Sync All'}
              </Button>
            </div>
          </div>
        </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0 scrollbar-hide">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/20">
            <Mail className="h-10 w-10 mb-4 opacity-20" />
            <p className="text-sm font-medium">No signals detected</p>
            <p className="text-[11px] font-mono">Sync Gmail to begin prioritization</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredEmails.map((email) => {
              const analysis = analyzedEmails.get(email.id);
              const isAnalyzed = !!analysis;
              const decision = analysis ? decisionConfig[analysis.decision] : null;
              const scoreColor = !analysis ? 'bg-white/5 text-white/20 border-white/5' :
                analysis.priorityScore >= 70 ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                analysis.priorityScore >= 40 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                'bg-white/5 text-white/40 border-white/10';

              return (
                <div
                  key={email.id}
                  className={`group relative flex items-start gap-4 p-4 hover:bg-white/[0.04] transition-all cursor-pointer border-b border-white/5 last:border-0 ${
                    analysis?.decision === 'ignore' ? 'opacity-40' : ''
                  }`}
                  onClick={() => onEmailClick(email, analysis)}
                >
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full ${scoreColor} border flex items-center justify-center font-bold text-sm font-mono shadow-sm`}>
                    {isProcessing && !isAnalyzed ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : isAnalyzed ? (
                      analysis.priorityScore
                    ) : (
                      '?'
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-white tracking-tight truncate max-w-[180px] text-sm">
                        {email.sender.name || email.sender.email}
                      </span>
                      {decision && (
                        <Badge variant="secondary" className={`${decision.bg} ${decision.text} border ${decision.border} text-[9px] px-1.5 py-0 uppercase tracking-widest font-bold`}>
                          {decision.label}
                        </Badge>
                      )}
                      <span className="text-[10px] text-white/30 ml-auto font-mono">
                        {getTimeAgo(email.timestamp)}
                      </span>
                    </div>

                    <p className="text-white/80 text-sm truncate font-medium">
                      {email.subject}
                    </p>

                    {isAnalyzed ? (
                      <p className="text-white/30 text-[11px] mt-1 flex items-center gap-1.5 truncate">
                        <Zap className="h-3 w-3 flex-shrink-0 text-white/20" />
                        <span className="truncate">{analysis.reasoning}</span>
                      </p>
                    ) : (
                      <Skeleton className="h-3 w-4/5 mt-2 bg-white/5 rounded-full" />
                    )}
                  </div>

                  {/* Hover Actions */}
                  {isAnalyzed && (
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all absolute right-2 top-11">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(email.id, 'opened');
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(email.id, 'dismissed');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      </Card>

      <PriorityRuleDialog
        isOpen={ruleDialog.isOpen}
        onClose={() => setRuleDialog({ ...ruleDialog, isOpen: false })}
        type={ruleDialog.type}
        onAdd={(value) => onAddRule({ type: ruleDialog.type, value })}
      />
    </>
  );
}
