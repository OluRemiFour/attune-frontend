// AI Email Priority Agent - Sub-Agent of Adaptive Goal Agent
import type {
  Email,
  EmailAnalysis,
  ScoringFactors,
  AgentDecision,
  AgentLoop,
  AgentTrace,
  UserPreferences,
  Goal,
  UserFeedback,
} from '@/types/agent';

// Learning weights that adapt based on user feedback
let learningWeights = {
  senderImportance: 0.25,
  contentRelevance: 0.30,
  actionRequired: 0.20,
  timingContext: 0.15,
  historicalBehavior: 0.10,
};

// VIP senders and historical data (in production, this would be from DB)
let senderHistory: Map<string, { interactions: number; openRate: number }> = new Map();

export class EmailPriorityAgent {
  private traces: AgentTrace[] = [];
  private userPreferences: UserPreferences;
  private userGoals: Goal[];

  constructor(preferences: UserPreferences, goals: Goal[]) {
    this.userPreferences = preferences;
    this.userGoals = goals;
  }

  // Main agent loop: Observe → Contextualize → Reason → Decide → Act → Learn
  async analyzeEmail(email: Email): Promise<EmailAnalysis> {
    const startTime = Date.now();
    const loops: AgentLoop[] = [];

    // Step 1: OBSERVE
    const observation = this.observe(email);
    loops.push({
      step: 'observe',
      data: observation,
      timestamp: new Date(),
    });

    // Step 2: CONTEXTUALIZE
    const context = this.contextualize(observation);
    loops.push({
      step: 'contextualize',
      data: context,
      timestamp: new Date(),
    });

    // Step 3: REASON
    const reasoning = this.reason(context);
    loops.push({
      step: 'reason',
      data: reasoning,
      timestamp: new Date(),
    });

    // Step 4: DECIDE
    const decision = this.decide(reasoning);
    loops.push({
      step: 'decide',
      data: decision,
      timestamp: new Date(),
    });

    // Step 5: ACT (prepare action)
    const action = this.act(decision, email);
    loops.push({
      step: 'act',
      data: action,
      timestamp: new Date(),
    });

    // Create trace for Comet logging
    const trace: AgentTrace = {
      id: `trace_${Date.now()}`,
      emailId: email.id,
      loops,
      finalDecision: decision.decision,
      reasoning: decision.reasoning,
      metrics: {
        processingTime: Date.now() - startTime,
        confidenceScore: reasoning.confidenceScore,
      },
      timestamp: new Date(),
    };

    this.traces.push(trace);

    return {
      emailId: email.id,
      priorityScore: reasoning.priorityScore,
      confidenceScore: reasoning.confidenceScore,
      factors: reasoning.factors,
      decision: decision.decision,
      reasoning: decision.reasoning,
      timestamp: new Date(),
    };
  }

  // OBSERVE: Extract relevant data from email
  private observe(email: Email) {
    return {
      sender: email.sender,
      subject: email.subject,
      bodyPreview: email.snippet,
      timestamp: email.timestamp,
      hasAttachments: email.hasAttachments,
      labels: email.labels,
      keywords: this.extractKeywords(email.subject + ' ' + email.snippet),
    };
  }

  // CONTEXTUALIZE: Add user context
  private contextualize(observation: ReturnType<typeof this.observe>) {
    const now = new Date();
    const currentHour = now.getHours();
    const workStart = parseInt(this.userPreferences.workHours.start.split(':')[0]);
    const workEnd = parseInt(this.userPreferences.workHours.end.split(':')[0]);
    const isWorkHours = currentHour >= workStart && currentHour < workEnd;

    const senderStats = senderHistory.get(observation.sender.email) || {
      interactions: 0,
      openRate: 0.5,
    };

    return {
      ...observation,
      userContext: {
        isWorkHours,
        focusModeActive: this.userPreferences.focusMode,
        urgencyThreshold: this.userPreferences.urgencyThreshold,
        isVipSender: this.userPreferences.vipSenders.includes(observation.sender.email),
        relevantGoals: this.findRelevantGoals(observation.keywords),
        senderHistory: senderStats,
      },
    };
  }

  // REASON: Calculate scores using multi-factor model
  private reason(context: ReturnType<typeof this.contextualize>) {
    const factors: ScoringFactors = {
      senderImportance: this.scoreSenderImportance(context),
      contentRelevance: this.scoreContentRelevance(context),
      actionRequired: this.scoreActionRequired(context),
      timingContext: this.scoreTimingContext(context),
      historicalBehavior: this.scoreHistoricalBehavior(context),
    };

    // Calculate weighted priority score
    const priorityScore = Math.round(
      factors.senderImportance.score * learningWeights.senderImportance +
      factors.contentRelevance.score * learningWeights.contentRelevance +
      factors.actionRequired.score * learningWeights.actionRequired +
      factors.timingContext.score * learningWeights.timingContext +
      factors.historicalBehavior.score * learningWeights.historicalBehavior
    );

    // Calculate confidence based on data quality
    const confidenceScore = this.calculateConfidence(context, factors);

    return {
      factors,
      priorityScore,
      confidenceScore,
    };
  }

  // DECIDE: Make final decision based on reasoning
  private decide(reasoning: ReturnType<typeof this.reason>): {
    decision: AgentDecision;
    reasoning: string;
  } {
    const { priorityScore, confidenceScore, factors } = reasoning;
    
    let decision: AgentDecision;
    let reasoningText: string;

    if (priorityScore >= 75 && confidenceScore >= 60) {
      decision = 'notify_immediately';
      reasoningText = `High priority email (${priorityScore}/100) with high confidence. ${factors.senderImportance.reason} ${factors.contentRelevance.reason}`;
    } else if (priorityScore >= 50 && priorityScore < 75) {
      decision = 'delay_notification';
      reasoningText = `Moderate priority email (${priorityScore}/100). Will notify when user exits focus mode or during next break. ${factors.timingContext.reason}`;
    } else if (priorityScore >= 25 && priorityScore < 50) {
      decision = 'batch_notification';
      reasoningText = `Lower priority email (${priorityScore}/100). Will include in next batch notification. ${factors.contentRelevance.reason}`;
    } else {
      decision = 'ignore';
      reasoningText = `Low priority email (${priorityScore}/100). No notification needed. ${factors.historicalBehavior.reason}`;
    }

    // Override for focus mode
    if (this.userPreferences.focusMode && decision === 'notify_immediately' && priorityScore < 90) {
      decision = 'delay_notification';
      reasoningText = `Focus mode active. ${reasoningText} Delaying until focus mode ends.`;
    }

    return { decision, reasoning: reasoningText };
  }

  // ACT: Prepare the action to be taken
  private act(
    decision: { decision: AgentDecision; reasoning: string },
    email: Email
  ) {
    return {
      type: 'notification_decision',
      emailId: email.id,
      emailSubject: email.subject,
      sender: email.sender.name || email.sender.email,
      decision: decision.decision,
      reasoning: decision.reasoning,
      actionTime: new Date(),
    };
  }

  // LEARN: Update weights based on user feedback
  learn(feedback: UserFeedback) {
    const adjustment = 0.02; // Small learning rate

    switch (feedback.action) {
      case 'opened':
        // User found it valuable - reinforce current weights
        break;
      case 'dismissed':
        // User didn't want it - reduce similar notifications
        learningWeights.senderImportance *= (1 - adjustment);
        learningWeights.contentRelevance *= (1 + adjustment);
        this.normalizeWeights();
        break;
      case 'ignored':
        // User never saw it - might be too aggressive with notifications
        learningWeights.timingContext *= (1 + adjustment);
        this.normalizeWeights();
        break;
      case 'reclassified':
        // User manually changed priority - learn from their preference
        if (feedback.reclassifiedTo === 'notify_immediately') {
          learningWeights.contentRelevance *= (1 + adjustment);
        } else if (feedback.reclassifiedTo === 'ignore') {
          learningWeights.senderImportance *= (1 - adjustment);
        }
        this.normalizeWeights();
        break;
    }

    // Update sender history
    const senderEmail = feedback.emailId; // In real app, look up sender from emailId
    const currentStats = senderHistory.get(senderEmail) || { interactions: 0, openRate: 0.5 };
    const wasOpened = feedback.action === 'opened' ? 1 : 0;
    const newOpenRate = (currentStats.openRate * currentStats.interactions + wasOpened) / (currentStats.interactions + 1);
    
    senderHistory.set(senderEmail, {
      interactions: currentStats.interactions + 1,
      openRate: newOpenRate,
    });

    return {
      step: 'learn',
      data: {
        feedback,
        updatedWeights: { ...learningWeights },
      },
      timestamp: new Date(),
    };
  }

  // Helper: Score sender importance
  private scoreSenderImportance(context: ReturnType<typeof this.contextualize>) {
    let score = 50; // Base score

    if (context.userContext.isVipSender) {
      score = 95;
      return { score, reason: 'VIP sender detected.' };
    }

    // Check sender history
    if (context.userContext.senderHistory.interactions > 5) {
      score = Math.min(100, 50 + context.userContext.senderHistory.openRate * 50);
    }

    // Check for known domains
    const importantDomains = ['ceo@', 'manager@', 'urgent@', '.edu', '.gov'];
    if (importantDomains.some(d => context.sender.email.includes(d))) {
      score = Math.min(100, score + 20);
    }

    return {
      score,
      reason: score > 70 ? 'Sender has high engagement history.' : 'Standard sender priority.',
    };
  }

  // Helper: Score content relevance to goals
  private scoreContentRelevance(context: ReturnType<typeof this.contextualize>) {
    const matchedGoals = context.userContext.relevantGoals;
    let score = 30; // Base score

    if (matchedGoals.length > 0) {
      score = Math.min(100, 50 + matchedGoals.length * 20);
    }

    // Check for urgent keywords
    const urgentKeywords = ['urgent', 'asap', 'deadline', 'important', 'action required', 'immediate'];
    const hasUrgent = urgentKeywords.some(k => 
      context.subject.toLowerCase().includes(k) || 
      context.bodyPreview.toLowerCase().includes(k)
    );

    if (hasUrgent) {
      score = Math.min(100, score + 25);
    }

    return {
      score,
      matchedGoals: matchedGoals.map(g => g.title),
      reason: matchedGoals.length > 0 
        ? `Matches ${matchedGoals.length} active goal(s): ${matchedGoals.map(g => g.title).join(', ')}.`
        : 'No direct goal relevance detected.',
    };
  }

  // Helper: Score action required
  private scoreActionRequired(context: ReturnType<typeof this.contextualize>) {
    const actionKeywords = [
      'please', 'could you', 'can you', 'need you to', 'action required',
      'respond', 'reply', 'confirm', 'approve', 'review', 'sign',
      'by end of day', 'by tomorrow', 'due date', 'deadline'
    ];

    const text = (context.subject + ' ' + context.bodyPreview).toLowerCase();
    const detected = actionKeywords.some(k => text.includes(k));
    const score = detected ? 80 : 30;

    return {
      score,
      detected,
      reason: detected ? 'Action or response appears to be required.' : 'No explicit action required.',
    };
  }

  // Helper: Score timing context
  private scoreTimingContext(context: ReturnType<typeof this.contextualize>) {
    let score = 50;
    const reasons: string[] = [];

    if (!context.userContext.isWorkHours) {
      score -= 20;
      reasons.push('Outside work hours.');
    }

    if (context.userContext.focusModeActive) {
      score -= 30;
      reasons.push('Focus mode active.');
    }

    // Recency bonus
    const emailAge = Date.now() - new Date(context.timestamp).getTime();
    const hoursOld = emailAge / (1000 * 60 * 60);
    if (hoursOld < 1) {
      score += 20;
      reasons.push('Very recent email.');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      isWorkHours: context.userContext.isWorkHours,
      focusModeActive: context.userContext.focusModeActive,
      reason: reasons.join(' ') || 'Normal timing context.',
    };
  }

  // Helper: Score historical behavior
  private scoreHistoricalBehavior(context: ReturnType<typeof this.contextualize>) {
    const history = context.userContext.senderHistory;
    
    if (history.interactions < 3) {
      return {
        score: 50,
        pastInteractions: history.interactions,
        openRate: history.openRate,
        reason: 'Insufficient history for this sender.',
      };
    }

    const score = Math.round(30 + history.openRate * 70);
    
    return {
      score,
      pastInteractions: history.interactions,
      openRate: history.openRate,
      reason: `Based on ${history.interactions} past interactions with ${Math.round(history.openRate * 100)}% open rate.`,
    };
  }

  // Helper: Extract keywords from text
  private extractKeywords(text: string): string[] {
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'just', 'don', 'now'];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  // Helper: Find goals that match keywords
  private findRelevantGoals(keywords: string[]): Goal[] {
    return this.userGoals.filter(goal => {
      const goalKeywords = [
        ...goal.keywords,
        ...goal.title.toLowerCase().split(' '),
        goal.category
      ];
      return keywords.some(k => goalKeywords.includes(k.toLowerCase()));
    });
  }

  // Helper: Calculate confidence score
  private calculateConfidence(
    context: ReturnType<typeof this.contextualize>,
    factors: ScoringFactors
  ): number {
    let confidence = 70; // Base confidence

    // More history = higher confidence
    if (context.userContext.senderHistory.interactions > 10) {
      confidence += 15;
    } else if (context.userContext.senderHistory.interactions > 5) {
      confidence += 10;
    }

    // VIP sender = higher confidence
    if (context.userContext.isVipSender) {
      confidence += 10;
    }

    // Action detected = higher confidence
    if (factors.actionRequired.detected) {
      confidence += 5;
    }

    return Math.min(100, confidence);
  }

  // Helper: Normalize weights to sum to 1
  private normalizeWeights() {
    const sum = Object.values(learningWeights).reduce((a, b) => a + b, 0);
    for (const key of Object.keys(learningWeights) as (keyof typeof learningWeights)[]) {
      learningWeights[key] /= sum;
    }
  }

  // Get all traces for Comet logging
  getTraces(): AgentTrace[] {
    return this.traces;
  }

  // Get current learning weights
  getWeights() {
    return { ...learningWeights };
  }
}

// Factory function
export function createEmailPriorityAgent(
  preferences: UserPreferences,
  goals: Goal[]
): EmailPriorityAgent {
  return new EmailPriorityAgent(preferences, goals);
}
