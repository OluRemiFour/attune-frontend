// Comet Integration Logger (Mock Implementation for MVP)
// In production, this would connect to Comet ML

import type { AgentTrace, AnalyticsData, CometLog } from '@/types/agent';

interface CometExperiment {
  key: string;
  name: string;
  startTime: Date;
  logs: CometLog[];
  metrics: Map<string, number[]>;
}

class CometLogger {
  private experiments: Map<string, CometExperiment> = new Map();
  private currentExperiment: CometExperiment | null = null;

  // Initialize a new experiment
  createExperiment(name: string): string {
    const key = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const experiment: CometExperiment = {
      key,
      name,
      startTime: new Date(),
      logs: [],
      metrics: new Map(),
    };
    this.experiments.set(key, experiment);
    this.currentExperiment = experiment;
    
    console.log(`[Comet] Created experiment: ${name} (${key})`);
    return key;
  }

  // Log an agent trace
  logTrace(trace: AgentTrace) {
    if (!this.currentExperiment) {
      console.warn('[Comet] No active experiment. Creating default.');
      this.createExperiment('default');
    }

    const log: CometLog = {
      experimentKey: this.currentExperiment!.key,
      trace,
      metrics: {
        processingTime: trace.metrics.processingTime,
        confidenceScore: trace.metrics.confidenceScore,
      },
      parameters: {
        decision: trace.finalDecision,
        emailId: trace.emailId,
      },
      tags: ['agent_trace', trace.finalDecision],
    };

    this.currentExperiment!.logs.push(log);
    
    // Log individual metrics
    this.logMetric('processing_time', trace.metrics.processingTime);
    this.logMetric('confidence_score', trace.metrics.confidenceScore);
    
    console.log(`[Comet] Logged trace for email ${trace.emailId}:`, {
      decision: trace.finalDecision,
      confidence: trace.metrics.confidenceScore,
    });
  }

  // Log a metric
  logMetric(name: string, value: number) {
    if (!this.currentExperiment) return;
    
    if (!this.currentExperiment.metrics.has(name)) {
      this.currentExperiment.metrics.set(name, []);
    }
    this.currentExperiment.metrics.get(name)!.push(value);
  }

  // Log analytics snapshot
  logAnalytics(analytics: AnalyticsData) {
    if (!this.currentExperiment) return;

    this.logMetric('total_emails_processed', analytics.totalEmailsProcessed);
    this.logMetric('notify_immediately_count', analytics.decisionsBreakdown.notifyImmediately);
    this.logMetric('delayed_count', analytics.decisionsBreakdown.delayed);
    this.logMetric('batched_count', analytics.decisionsBreakdown.batched);
    this.logMetric('ignored_count', analytics.decisionsBreakdown.ignored);
    this.logMetric('precision', analytics.accuracy.precision);
    this.logMetric('recall', analytics.accuracy.recall);
    this.logMetric('false_positives', analytics.accuracy.falsePositives);
    this.logMetric('user_overrides', analytics.userOverrides);
    this.logMetric('time_saved_minutes', analytics.timeSavedMinutes);
    this.logMetric('avg_confidence', analytics.avgConfidenceScore);

    console.log('[Comet] Logged analytics snapshot:', analytics);
  }

  // Log user feedback
  logFeedback(emailId: string, action: string, reclassifiedTo?: string) {
    this.logMetric('feedback_count', 1);
    
    if (action === 'reclassified') {
      this.logMetric('reclassification_count', 1);
    }

    console.log(`[Comet] Logged feedback for ${emailId}: ${action}${reclassifiedTo ? ` -> ${reclassifiedTo}` : ''}`);
  }

  // Get experiment summary
  getExperimentSummary() {
    if (!this.currentExperiment) return null;

    const metrics: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    this.currentExperiment.metrics.forEach((values, name) => {
      const sum = values.reduce((a, b) => a + b, 0);
      metrics[name] = {
        avg: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    });

    return {
      key: this.currentExperiment.key,
      name: this.currentExperiment.name,
      duration: Date.now() - this.currentExperiment.startTime.getTime(),
      totalLogs: this.currentExperiment.logs.length,
      metrics,
    };
  }

  // Get all logs for current experiment
  getLogs(): CometLog[] {
    return this.currentExperiment?.logs || [];
  }

  // End experiment
  endExperiment() {
    if (this.currentExperiment) {
      console.log(`[Comet] Ended experiment: ${this.currentExperiment.name}`);
      this.currentExperiment = null;
    }
  }
}

// Singleton instance
export const cometLogger = new CometLogger();

// Initialize default experiment
cometLogger.createExperiment('aga_mvp_demo');
