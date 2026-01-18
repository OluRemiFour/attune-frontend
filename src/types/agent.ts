// Agent Types for Adaptive Goal Agent System

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  gmailConnected: boolean;
  preferences: UserPreferences;
  goals: Goal[];
  createdAt: Date;
}

export interface UserPreferences {
  workHours: {
    start: string; // "09:00"
    end: string; // "17:00"
  };
  focusMode: boolean;
  urgencyThreshold: number; // 0-100
  vipSenders: string[];
  interests: string[];
  notificationPreferences: {
    immediate: boolean;
    batched: boolean;
    batchInterval: number; // minutes
  };
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'productivity' | 'focus' | 'learning' | 'health' | 'custom';
  priority: 'high' | 'medium' | 'low';
  keywords: string[];
  deadline?: Date;
  progress: number; // 0-100
  createdAt: Date;
}

export interface Email {
  id: string;
  threadId: string;
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  snippet: string;
  body: string;
  timestamp: Date;
  labels: string[];
  isRead: boolean;
  hasAttachments: boolean;
}

export interface EmailAnalysis {
  emailId: string;
  priorityScore: number; // 0-100
  confidenceScore: number; // 0-100
  factors: ScoringFactors;
  decision: AgentDecision;
  reasoning: string;
  timestamp: Date;
}

export interface ScoringFactors {
  senderImportance: {
    score: number;
    reason: string;
  };
  contentRelevance: {
    score: number;
    matchedGoals: string[];
    reason: string;
  };
  actionRequired: {
    score: number;
    detected: boolean;
    reason: string;
  };
  timingContext: {
    score: number;
    isWorkHours: boolean;
    focusModeActive: boolean;
    reason: string;
  };
  historicalBehavior: {
    score: number;
    pastInteractions: number;
    openRate: number;
    reason: string;
  };
}

export type AgentDecision = 
  | 'notify_immediately'
  | 'delay_notification'
  | 'batch_notification'
  | 'ignore';

export interface AgentAction {
  id: string;
  type: 'email_analysis' | 'notification_sent' | 'batch_created' | 'learning_update';
  emailId?: string;
  decision: AgentDecision;
  reasoning: string;
  timestamp: Date;
  userFeedback?: UserFeedback;
}

export interface UserFeedback {
  emailId: string;
  action: 'opened' | 'dismissed' | 'ignored' | 'reclassified';
  reclassifiedTo?: AgentDecision;
  timestamp: Date;
}

export interface AgentLoop {
  step: 'observe' | 'contextualize' | 'reason' | 'decide' | 'act' | 'learn';
  data: any;
  timestamp: Date;
}

export interface AgentTrace {
  id: string;
  emailId: string;
  loops: AgentLoop[];
  finalDecision: AgentDecision;
  reasoning: string;
  metrics: {
    processingTime: number;
    confidenceScore: number;
  };
  timestamp: Date;
}

export interface AnalyticsData {
  totalEmailsProcessed: number;
  decisionsBreakdown: {
    notifyImmediately: number;
    delayed: number;
    batched: number;
    ignored: number;
  };
  accuracy: {
    precision: number;
    recall: number;
    falsePositives: number;
  };
  userOverrides: number;
  timeSavedMinutes: number;
  avgConfidenceScore: number;
}

export interface CometLog {
  experimentKey: string;
  trace: AgentTrace;
  metrics: Record<string, number>;
  parameters: Record<string, any>;
  tags: string[];
}
