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
        setUser(prev => prev ? ({ ...prev, goals }) : prev);
        
        if (isConnected) {
          const fetchedEmails = await emailService.fetchEmails(user.id);
          setEmails(fetchedEmails);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadData();
  }, [isConnected, user?.id]);

  // Connect Gmail
  const connectGmail = useCallback(async () => {
    setIsProcessing(true);
    try {
      const { url } = await authService.connectGmail();
      
      // Open popup
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        url,
        'Connect Gmail',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from popup
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'AUTH_SUCCESS' && event.data.user) {
          const userData = event.data.user;
          
          // Construct full user object (preserving client-side only defaults if needed)
          const newUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            gmailConnected: true,
            goals: [], // Will be loaded separately
            preferences: {
              focusMode: false,
              workHours: userData.preferences?.workHours || { start: '09:00', end: '17:00' },
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
          
          window.removeEventListener('message', handleMessage);
          if (popup) popup.close();
        }
      };
      
      window.addEventListener('message', handleMessage);

    } catch (error) {
      console.error('Failed to connect:', error);
      setIsProcessing(false);
    }
  }, []);

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

  // Update goal context (work hours, focus state, priorities)
  const updateGoalContext = useCallback((goals: Goal[]) => {
    if (!user) return;
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
  }, [user?.preferences.workHours, focusMode]);

  // Add goal
  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!user) return;
    try {
      const newGoal = await goalService.addGoal({ ...goalData, userId: user.id });
      
      // Refresh goals from backend to ensure sync
      const updatedGoals = await goalService.getGoals(user.id);
      setUser(prev => prev ? ({
        ...prev,
        goals: updatedGoals,
      }) : prev);
      
      // Update context based on new goal
      updateGoalContext(updatedGoals);
    } catch (error) {
      console.error('Failed to add goal:', error);
      throw error;
    }
  }, [user?.id, updateGoalContext]);

  // Remove goal
  const removeGoal = useCallback((goalId: string) => {
    // Implement delete API call if needed
    setUser(prev => prev ? ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId),
    }) : prev);
  }, []);

  // Toggle focus mode
  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => !prev);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((preferences: Partial<User['preferences']>) => {
    setUser(prev => prev ? ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }) : prev);
  }, []);

  // Add Priority Rule
  const addPriorityRule = useCallback(async (rule: PriorityRule) => {
    if (!user) return;
    console.log('Adding priority rule:', rule);
    
    // Update local state immediately
    setUser(prev => {
      if (!prev) return prev;
      const newPreferences = { ...prev.preferences };
      
      if (rule.type === 'sender') {
        newPreferences.vipSenders = [...(newPreferences.vipSenders || []), rule.value];
      } else {
        newPreferences.interests = [...(newPreferences.interests || []), rule.value];
      }
      
      return { ...prev, preferences: newPreferences };
    });

    // In a real app, we would make the API call here
    // await api.post('/agent/priority-rules', { ...rule, userId: user.id });
  }, [user?.id]);



  // Sub-agent decision logic
  const decideSubAgent = useCallback((email: Email, context: { goals: Goal[], focusMode: boolean, workHours: any, preferences?: any }) => {
    // Determine which sub-agent should handle this email
    const currentHour = new Date().getHours();
    const workStart = parseInt(context.workHours.start.split(':')[0]);
    const workEnd = parseInt(context.workHours.end.split(':')[0]);
    const isWorkHours = currentHour >= workStart && currentHour < workEnd;
    
    // Check VIP Senders
    if (context.preferences?.vipSenders?.some((sender: string) => email.sender.email.toLowerCase().includes(sender.toLowerCase()) || email.sender.name.toLowerCase().includes(sender.toLowerCase()))) {
      return 'notify_immediately';
    }

    // Check Interests/Keywords
    if (context.preferences?.interests?.some((interest: string) => 
      email.subject.toLowerCase().includes(interest.toLowerCase()) || 
      email.body?.toLowerCase().includes(interest.toLowerCase())
    )) {
      return 'notify_immediately';
    }
    
    // Decision logic
    if (context.focusMode && !isWorkHours) {
      return 'delay_notification'; // Delay notifications outside work hours in focus mode
    }
    
    // Check if email relates to any goals
    const relatedGoals = context.goals.filter(goal => 
      email.subject.toLowerCase().includes(goal.title.toLowerCase()) ||
      email.body?.toLowerCase().includes(goal.title.toLowerCase())
    );
    
    if (relatedGoals.length > 0) {
      return 'notify_immediately'; // Notify immediately if related to goals
    }
    
    return 'batch_notification'; // Default to batch processing
  }, []);

  // Update analysis when preferences/goals change
  useEffect(() => {
    if (!user || emails.length === 0) return;
    
    // Re-run decision logic for recent emails
    const reAnalyze = async () => {
      let changed = false;
      const newMap = new Map(analyzedEmails);
      
      emails.forEach(email => {
        const currentAnalysis = newMap.get(email.id);
        if (!currentAnalysis) return;
        
        const newDecision = decideSubAgent(email, {
          goals: user.goals,
          focusMode,
          workHours: user.preferences.workHours,
          preferences: user.preferences
        });
        
        if (newDecision !== currentAnalysis.decision) {
          // If decision changed to notify_immediately due to rule, boost priority score
          let newScore = currentAnalysis.priorityScore;
          if (newDecision === 'notify_immediately' && currentAnalysis.decision !== 'notify_immediately') {
             newScore = Math.max(newScore, 90);
          }
          
          newMap.set(email.id, {
            ...currentAnalysis,
            decision: newDecision === 'notify_immediately' ? 'notify_immediately' : 
                      newDecision === 'delay_notification' ? 'delay_notification' : 
                      'batch_notification', // Map back to AgentDecision type
            priorityScore: newScore,
            reasoning: newDecision === 'notify_immediately' ? 'Matched priority rule or goal' : currentAnalysis.reasoning
          });
          changed = true;
        }
      });
      
      if (changed) {
         setAnalyzedEmails(newMap);
      }
    };
    
    reAnalyze();
    // Debounce this in real app, but for now specific dependencies
  }, [user?.preferences.vipSenders, user?.preferences.interests, user?.goals, focusMode]);

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
    updateGoals: (goals) => setUser(prev => prev ? ({ ...prev, goals }) : prev),
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
