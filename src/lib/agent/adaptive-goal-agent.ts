// Adaptive Goal Agent - Primary Agent
import type {
  User,
  Email,
  EmailAnalysis,
  AgentAction,
  UserFeedback,
  AnalyticsData,
  AgentTrace,
  Goal,
} from '@/types/agent';
import { EmailPriorityAgent, createEmailPriorityAgent } from './email-priority-agent';

export class AdaptiveGoalAgent {
  private user: User;
  private emailAgent: EmailPriorityAgent;
  private actions: AgentAction[] = [];
  private analytics: AnalyticsData;

  constructor(user: User) {
    this.user = user;
    this.emailAgent = createEmailPriorityAgent(user.preferences, user.goals);
    this.analytics = this.initializeAnalytics();
  }

  private initializeAnalytics(): AnalyticsData {
    return {
      totalEmailsProcessed: 0,
      decisionsBreakdown: {
        notifyImmediately: 0,
        delayed: 0,
        batched: 0,
        ignored: 0,
      },
      accuracy: {
        precision: 0.85,
        recall: 0.78,
        falsePositives: 0,
      },
      userOverrides: 0,
      timeSavedMinutes: 0,
      avgConfidenceScore: 0,
    };
  }

  // Process incoming email through the email priority sub-agent
  async processEmail(email: Email): Promise<EmailAnalysis> {
    const analysis = await this.emailAgent.analyzeEmail(email);

    // Update analytics
    this.analytics.totalEmailsProcessed++;
    this.updateDecisionBreakdown(analysis.decision);
    this.updateAverageConfidence(analysis.confidenceScore);
    this.estimateTimeSaved(analysis.decision);

    // Log action
    const action: AgentAction = {
      id: `action_${Date.now()}`,
      type: 'email_analysis',
      emailId: email.id,
      decision: analysis.decision,
      reasoning: analysis.reasoning,
      timestamp: new Date(),
    };
    this.actions.push(action);

    return analysis;
  }

  // Process user feedback and trigger learning
  processFeedback(feedback: UserFeedback) {
    // Find the corresponding action
    const action = this.actions.find(a => a.emailId === feedback.emailId);
    if (action) {
      action.userFeedback = feedback;
    }

    // Trigger learning in email agent
    this.emailAgent.learn(feedback);

    // Update analytics
    if (feedback.action === 'reclassified') {
      this.analytics.userOverrides++;
      this.analytics.accuracy.falsePositives++;
    }

    // Log learning action
    const learningAction: AgentAction = {
      id: `action_${Date.now()}`,
      type: 'learning_update',
      emailId: feedback.emailId,
      decision: feedback.reclassifiedTo || 'notify_immediately',
      reasoning: `User ${feedback.action} the notification. Adjusting weights accordingly.`,
      timestamp: new Date(),
    };
    this.actions.push(learningAction);
  }

  // Update user goals
  updateGoals(goals: Goal[]) {
    this.user.goals = goals;
    this.emailAgent = createEmailPriorityAgent(this.user.preferences, goals);
  }

  // Toggle focus mode
  setFocusMode(enabled: boolean) {
    this.user.preferences.focusMode = enabled;
    this.emailAgent = createEmailPriorityAgent(this.user.preferences, this.user.goals);
  }

  // Update user preferences
  updatePreferences(preferences: Partial<User['preferences']>) {
    this.user.preferences = { ...this.user.preferences, ...preferences };
    this.emailAgent = createEmailPriorityAgent(this.user.preferences, this.user.goals);
  }

  // Get analytics data
  getAnalytics(): AnalyticsData {
    return { ...this.analytics };
  }

  // Get all traces for Comet
  getTraces(): AgentTrace[] {
    return this.emailAgent.getTraces();
  }

  // Get all actions
  getActions(): AgentAction[] {
    return [...this.actions];
  }

  // Get current weights
  getLearningWeights() {
    return this.emailAgent.getWeights();
  }

  // Get user
  getUser(): User {
    return { ...this.user };
  }

  // Private: Update decision breakdown
  private updateDecisionBreakdown(decision: EmailAnalysis['decision']) {
    switch (decision) {
      case 'notify_immediately':
        this.analytics.decisionsBreakdown.notifyImmediately++;
        break;
      case 'delay_notification':
        this.analytics.decisionsBreakdown.delayed++;
        break;
      case 'batch_notification':
        this.analytics.decisionsBreakdown.batched++;
        break;
      case 'ignore':
        this.analytics.decisionsBreakdown.ignored++;
        break;
    }
  }

  // Private: Update average confidence
  private updateAverageConfidence(newConfidence: number) {
    const total = this.analytics.totalEmailsProcessed;
    this.analytics.avgConfidenceScore = 
      ((this.analytics.avgConfidenceScore * (total - 1)) + newConfidence) / total;
  }

  // Private: Estimate time saved
  private estimateTimeSaved(decision: EmailAnalysis['decision']) {
    // Estimate minutes saved based on decision
    const timeSavedMap = {
      notify_immediately: 0,
      delay_notification: 2,
      batch_notification: 3,
      ignore: 5,
    };
    this.analytics.timeSavedMinutes += timeSavedMap[decision];
  }
}

// Factory function
export function createAdaptiveGoalAgent(user: User): AdaptiveGoalAgent {
  return new AdaptiveGoalAgent(user);
}
