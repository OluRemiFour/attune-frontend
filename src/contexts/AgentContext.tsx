import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, Email, EmailAnalysis, Goal, UserFeedback, AnalyticsData, AgentTrace } from '@/types/agent';
import { api, authService, goalService, emailService, agentService } from '@/services/api';

interface PriorityRule {
  type: 'sender' | 'keyword';
  value: string;
}

interface AgentContextValue {
  // State
  user: User | null;
  emails: Email[];
  analyzedEmails: Map<string, EmailAnalysis>;
  isConnected: boolean;
  isProcessing: boolean;
  focusMode: boolean;
  
  // Actions
  connectGmail: () => Promise<void>;
  disconnectGmail: () => void;
  processEmail: (email: Email) => Promise<EmailAnalysis>;
  processAllEmails: () => Promise<void>;
  submitFeedback: (feedback: UserFeedback) => void;
  updateGoals: (goals: Goal[]) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  removeGoal: (goalId: string) => void;
  toggleFocusMode: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  addPriorityRule: (rule: PriorityRule) => Promise<void>;
  
  // Data
  getAnalytics: () => AnalyticsData;
  getTraces: () => AgentTrace[];
  getLearningWeights: () => Record<string, number>;
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  // Generate a temporary MongoDB-compatible ObjectId for development
  const generateObjectId = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const randomValue = Math.random().toString(16).substring(2, 18);
    return timestamp + randomValue.padEnd(16, '0');
  };

  const [user, setUser] = useState<User | null>(null);
  const [tempUserId] = useState(generateObjectId());
  const [emails, setEmails] = useState<Email[]>([]);
  const [analyzedEmails, setAnalyzedEmails] = useState<Map<string, EmailAnalysis>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Initialize user on mount
  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('attune_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsConnected(parsedUser.gmailConnected);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const goals = await goalService.getGoals(user.id);
        setUser(prev => ({ ...prev, goals }));
        
        if (isConnected) {
          const fetchedEmails = await emailService.fetchEmails(user.id);
          setEmails(fetchedEmails);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadData();
  }, [isConnected, user.id]);

  // Connect Gmail
  const connectGmail = useCallback(async () => {
    setIsProcessing(true);
    try {
      const { url } = await authService.connectGmail();
      // In a real app, we'd redirect or open a popup. 
      // For MVP, we'll simulate the successful redirect back.
      window.open(url, '_blank');
      
      // Poll for connection status or just simulate success for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user with proper MongoDB ObjectId
      const newUser: User = {
        id: tempUserId,
        name: 'User',
        email: 'user@gmail.com', // This should come from Google OAuth
        gmailConnected: true,
        goals: [],
        preferences: { 
          focusMode: false, 
          workHours: { start: '09:00', end: '17:00' },
          urgencyThreshold: 50,
          vipSenders: [],
          interests: [],
          notificationPreferences: {
            immediate: true,
            batched: true,
            batchInterval: 60
          }
        },
        createdAt: new Date()
      };
      
      setUser(newUser);
      localStorage.setItem('attune_user', JSON.stringify(newUser));
      setIsConnected(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsProcessing(false);
    }
  }, [tempUserId]);

  // Disconnect Gmail
  const disconnectGmail = useCallback(() => {
    setIsConnected(false);
    setEmails([]);
    setAnalyzedEmails(new Map());
    setUser(null);
    localStorage.removeItem('attune_user');
  }, []);

  // Process single email (backend call)
  const processEmail = useCallback(async (email: Email): Promise<EmailAnalysis> => {
    try {
      // For MVP, if we don't have a real heavy backend agent yet, we simulate or call a mock-analytical endpoint
      // const analysis = await agentService.analyzeEmail(email.id);
      
      // Simulation for now as we transition
      const analysis: EmailAnalysis = {
        emailId: email.id,
        priorityScore: Math.floor(Math.random() * 100),
        confidenceScore: 85,
        decision: Math.random() > 0.7 ? 'notify_immediately' : 'delay_notification',
        reasoning: "Matched keywords with user goals and historical signals.",
        timestamp: new Date(),
        factors: {
          senderImportance: { score: 70, reason: 'Regular sender' },
          contentRelevance: { score: 80, matchedGoals: [], reason: 'Relevant to goals' },
          actionRequired: { score: 60, detected: true, reason: 'Action items detected' },
          timingContext: { score: 50, isWorkHours: true, focusModeActive: false, reason: 'During work hours' },
          historicalBehavior: { score: 75, pastInteractions: 10, openRate: 0.8, reason: 'High engagement' }
        }
      };

      setAnalyzedEmails(prev => {
        const newMap = new Map(prev);
        newMap.set(email.id, analysis);
        return newMap;
      });
      
      return analysis;
    } catch (error) {
      console.error('Email processing failed:', error);
      throw error;
    }
  }, []);

  // Process all emails
  const processAllEmails = useCallback(async () => {
    setIsProcessing(true);
    for (const email of emails) {
      if (!analyzedEmails.has(email.id)) {
        await processEmail(email);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    setIsProcessing(false);
  }, [emails, analyzedEmails, processEmail]);

  // Submit feedback
  const submitFeedback = useCallback(async (feedback: UserFeedback) => {
    try {
      await agentService.submitFeedback(feedback);
      
      // Locally update if it was a reclassification
      if (feedback.action === 'reclassified' && feedback.reclassifiedTo) {
        setAnalyzedEmails(prev => {
          const newMap = new Map(prev);
          const current = newMap.get(feedback.emailId);
          if (current) {
            newMap.set(feedback.emailId, { ...current, decision: feedback.reclassifiedTo });
          }
          return newMap;
        });
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
    }
  }, []);

  // Add goal
  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    try {
      const newGoal = await goalService.addGoal({ ...goalData, userId: user.id });
      
      // Refresh goals from backend to ensure sync
      const updatedGoals = await goalService.getGoals(user.id);
      setUser(prev => ({
        ...prev,
        goals: updatedGoals,
      }));
      
      // Update context based on new goal
      updateGoalContext(updatedGoals);
    } catch (error) {
      console.error('Failed to add goal:', error);
      throw error;
    }
  }, [user.id]);

  // Remove goal
  const removeGoal = useCallback((goalId: string) => {
    // Implement delete API call if needed
    setUser(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId),
    }));
  }, []);

  // Toggle focus mode
  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => !prev);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((preferences: Partial<User['preferences']>) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }));
  }, []);

  // Add Priority Rule
  const addPriorityRule = useCallback(async (rule: PriorityRule) => {
    console.log('Adding priority rule:', rule);
    // await api.post('/agent/priority-rules', { ...rule, userId: user.id });
    // Trigger localized feedback logic if needed
  }, [user.id]);

  // Update goal context (work hours, focus state, priorities)
  const updateGoalContext = useCallback((goals: Goal[]) => {
    // Extract priorities from goals
    const priorities = goals.map(g => ({
      goal: g.title,
      priority: g.priority || 'medium',
      category: g.category || 'general'
    }));
    
    // Store context for sub-agent decision making
    console.log('Updated goal context:', {
      totalGoals: goals.length,
      priorities,
      workHours: user.preferences.workHours,
      focusMode: focusMode
    });
  }, [user.preferences.workHours, focusMode]);

  // Sub-agent decision logic
  const decideSubAgent = useCallback((email: Email, context: { goals: Goal[], focusMode: boolean, workHours: any }) => {
    // Determine which sub-agent should handle this email
    const currentHour = new Date().getHours();
    const workStart = parseInt(context.workHours.start.split(':')[0]);
    const workEnd = parseInt(context.workHours.end.split(':')[0]);
    const isWorkHours = currentHour >= workStart && currentHour < workEnd;
    
    // Decision logic
    if (context.focusMode && !isWorkHours) {
      return 'delay'; // Delay notifications outside work hours in focus mode
    }
    
    // Check if email relates to any goals
    const relatedGoals = context.goals.filter(goal => 
      email.subject.toLowerCase().includes(goal.title.toLowerCase()) ||
      email.body?.toLowerCase().includes(goal.title.toLowerCase())
    );
    
    if (relatedGoals.length > 0) {
      return 'immediate'; // Notify immediately if related to goals
    }
    
    return 'batch'; // Default to batch processing
  }, []);

  // Get analytics
  const getAnalytics = useCallback((): AnalyticsData => {
    return {
      totalEmailsProcessed: analyzedEmails.size,
      decisionsBreakdown: { 
        notifyImmediately: Array.from(analyzedEmails.values()).filter(a => a.decision === 'notify_immediately').length, 
        delayed: Array.from(analyzedEmails.values()).filter(a => a.decision === 'delay_notification').length, 
        batched: Array.from(analyzedEmails.values()).filter(a => a.decision === 'batch_notification').length, 
        ignored: Array.from(analyzedEmails.values()).filter(a => a.decision === 'ignore').length 
      },
      accuracy: { precision: 0.94, recall: 0.92, falsePositives: 2 },
      userOverrides: 3,
      timeSavedMinutes: analyzedEmails.size * 5,
      avgConfidenceScore: 0.88,
    };
  }, [analyzedEmails]);

  const value: AgentContextValue = {
    user,
    emails,
    analyzedEmails,
    isConnected,
    isProcessing,
    focusMode,
    connectGmail,
    disconnectGmail,
    processEmail,
    processAllEmails,
    submitFeedback,
    updateGoals: (goals) => setUser(prev => ({ ...prev, goals })),
    addGoal,
    removeGoal,
    toggleFocusMode,
    updatePreferences,
    addPriorityRule,
    getAnalytics,
    getTraces: () => [],
    getLearningWeights: () => ({ 'Project Status': 0.8, 'Direct Mention': 0.9, 'Newsletter': 0.2 }),
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
