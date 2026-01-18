// Mock data for demonstration
import type { User, Email, Goal, UserPreferences } from '@/types/agent';

export const mockUserPreferences: UserPreferences = {
  workHours: {
    start: '09:00',
    end: '17:00',
  },
  focusMode: false,
  urgencyThreshold: 70,
  vipSenders: ['ceo@company.com', 'manager@company.com', 'spouse@personal.com'],
  interests: ['productivity', 'ai', 'machine learning', 'startups'],
  notificationPreferences: {
    immediate: true,
    batched: true,
    batchInterval: 30,
  },
};

export const mockGoals: Goal[] = [
  {
    id: 'goal_1',
    title: 'Complete AI Project',
    description: 'Finish the AI agent system for the hackathon',
    category: 'productivity',
    priority: 'high',
    keywords: ['ai', 'agent', 'hackathon', 'project', 'deadline', 'development'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 45,
    createdAt: new Date(),
  },
  {
    id: 'goal_2',
    title: 'Learn Machine Learning',
    description: 'Study ML fundamentals and neural networks',
    category: 'learning',
    priority: 'medium',
    keywords: ['machine learning', 'ml', 'neural', 'course', 'study', 'training'],
    progress: 30,
    createdAt: new Date(),
  },
  {
    id: 'goal_3',
    title: 'Maintain Work-Life Balance',
    description: 'Keep focus time sacred and avoid unnecessary interruptions',
    category: 'focus',
    priority: 'high',
    keywords: ['focus', 'balance', 'productivity', 'wellness'],
    progress: 60,
    createdAt: new Date(),
  },
];

export const mockUser: User = {
  id: 'user_1',
  email: 'demo@example.com',
  name: 'Demo User',
  gmailConnected: true,
  preferences: mockUserPreferences,
  goals: mockGoals,
  createdAt: new Date(),
};

export const mockEmails: Email[] = [
  {
    id: 'email_1',
    threadId: 'thread_1',
    sender: {
      name: 'CEO John Smith',
      email: 'ceo@company.com',
    },
    subject: 'URGENT: Q1 Strategy Meeting Tomorrow',
    snippet: 'Please confirm your attendance for the Q1 strategy meeting tomorrow at 10 AM. We need to discuss the AI project deadline and resource allocation.',
    body: 'Please confirm your attendance for the Q1 strategy meeting tomorrow at 10 AM. We need to discuss the AI project deadline and resource allocation. This is a mandatory meeting for all team leads.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    labels: ['INBOX', 'IMPORTANT'],
    isRead: false,
    hasAttachments: false,
  },
  {
    id: 'email_2',
    threadId: 'thread_2',
    sender: {
      name: 'Newsletter Bot',
      email: 'newsletter@techdigest.com',
    },
    subject: 'Weekly Tech Digest: AI News and More',
    snippet: 'This week in tech: New AI breakthroughs, startup funding rounds, and more...',
    body: 'This week in tech: New AI breakthroughs, startup funding rounds, and more. Subscribe for premium content.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    labels: ['INBOX', 'PROMOTIONS'],
    isRead: false,
    hasAttachments: false,
  },
  {
    id: 'email_3',
    threadId: 'thread_3',
    sender: {
      name: 'Sarah Manager',
      email: 'manager@company.com',
    },
    subject: 'Re: Project Update Needed',
    snippet: 'Could you please send me the updated progress report for the hackathon project by end of day?',
    body: 'Hi, Could you please send me the updated progress report for the hackathon project by end of day? The stakeholders are asking for an update. Thanks, Sarah',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    labels: ['INBOX'],
    isRead: false,
    hasAttachments: false,
  },
  {
    id: 'email_4',
    threadId: 'thread_4',
    sender: {
      name: 'LinkedIn',
      email: 'notifications@linkedin.com',
    },
    subject: 'You have 5 new connection requests',
    snippet: 'Check out who wants to connect with you on LinkedIn...',
    body: 'Check out who wants to connect with you on LinkedIn. Also, see 10 jobs that match your profile.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    labels: ['INBOX', 'SOCIAL'],
    isRead: false,
    hasAttachments: false,
  },
  {
    id: 'email_5',
    threadId: 'thread_5',
    sender: {
      name: 'Coursera',
      email: 'courses@coursera.org',
    },
    subject: 'Your ML Course: New Module Available',
    snippet: 'A new module on Neural Networks is now available in your Machine Learning course. Continue learning!',
    body: 'Hi there, A new module on Neural Networks is now available in your Machine Learning course. This module covers: Deep Learning fundamentals, Backpropagation, and CNN architectures. Continue learning!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    labels: ['INBOX'],
    isRead: false,
    hasAttachments: false,
  },
  {
    id: 'email_6',
    threadId: 'thread_6',
    sender: {
      name: 'Alex Teammate',
      email: 'alex@company.com',
    },
    subject: 'Quick question about the API',
    snippet: 'Hey, quick question - which endpoint should I use for the agent trace logging?',
    body: 'Hey, quick question - which endpoint should I use for the agent trace logging? I want to make sure we are consistent with the rest of the team. No rush, whenever you get a chance.',
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 mins ago
    labels: ['INBOX'],
    isRead: false,
    hasAttachments: false,
  },
];

// Sample agent decision outputs for demo
export const sampleAgentDecisions = [
  {
    email: mockEmails[0],
    decision: 'notify_immediately',
    priorityScore: 92,
    confidenceScore: 88,
    reasoning: 'High priority email (92/100) with high confidence. VIP sender detected. Matches 1 active goal(s): Complete AI Project.',
  },
  {
    email: mockEmails[1],
    decision: 'ignore',
    priorityScore: 18,
    confidenceScore: 82,
    reasoning: 'Low priority email (18/100). No notification needed. Standard sender priority. No direct goal relevance detected.',
  },
  {
    email: mockEmails[2],
    decision: 'notify_immediately',
    priorityScore: 85,
    confidenceScore: 85,
    reasoning: 'High priority email (85/100) with high confidence. VIP sender detected. Action or response appears to be required. Matches 1 active goal(s): Complete AI Project.',
  },
  {
    email: mockEmails[3],
    decision: 'ignore',
    priorityScore: 12,
    confidenceScore: 90,
    reasoning: 'Low priority email (12/100). No notification needed. No explicit action required. No direct goal relevance detected.',
  },
  {
    email: mockEmails[4],
    decision: 'batch_notification',
    priorityScore: 48,
    confidenceScore: 75,
    reasoning: 'Lower priority email (48/100). Will include in next batch notification. Matches 1 active goal(s): Learn Machine Learning.',
  },
  {
    email: mockEmails[5],
    decision: 'delay_notification',
    priorityScore: 55,
    confidenceScore: 70,
    reasoning: 'Moderate priority email (55/100). Will notify when user exits focus mode or during next break. No explicit action required.',
  },
];
