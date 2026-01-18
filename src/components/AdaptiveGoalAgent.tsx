import { useState } from 'react';
import { LandingPage } from '@/components/pages/LandingPage';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { useAgent, AgentProvider } from '@/contexts/AgentContext';
import { Loader2 } from 'lucide-react';

function AdaptiveGoalAgentContent() {
  const {
    user,
    emails,
    analyzedEmails,
    isConnected,
    isProcessing,
    focusMode,
    connectGmail,
    disconnectGmail,
    processAllEmails,
    submitFeedback,
    toggleFocusMode,
    addGoal,
    removeGoal,
    addPriorityRule,
    getAnalytics,
    getLearningWeights,
  } = useAgent();

  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectGmail = async () => {
    setIsConnecting(true);
    try {
      await connectGmail();
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSetGoals = () => {
    if (isConnected) {
      setCurrentPage('dashboard');
    } else {
      handleConnectGmail();
    }
  };

  const handleDisconnect = () => {
    disconnectGmail();
    setCurrentPage('landing');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  // Show loading overlay when connecting
  if (isConnecting) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center animate-pulse">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-slate-900">Connecting to Gmail...</p>
        <p className="mt-2 text-sm text-slate-500">Setting up your AI agent</p>
      </div>
    );
  }

  // Require Google OAuth before dashboard access
  if (currentPage === 'dashboard' && !isConnected) {
    // Redirect to landing page if trying to access dashboard without authentication
    setCurrentPage('landing');
    return (
      <LandingPage
        onConnectGmail={handleConnectGmail}
        onSetGoals={handleSetGoals}
        onDashboard={() => setCurrentPage('dashboard')}
        isConnected={isConnected}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <DashboardPage
        user={user}
        emails={emails}
        analyzedEmails={analyzedEmails}
        isProcessing={isProcessing}
        focusMode={focusMode}
        isConnected={isConnected}
        onProcessAll={processAllEmails}
        onFeedback={submitFeedback}
        onToggleFocusMode={toggleFocusMode}
        onDisconnect={handleDisconnect}
        onBackToLanding={handleBackToLanding}
        onAddGoal={addGoal}
        onRemoveGoal={removeGoal}
        addPriorityRule={addPriorityRule}
        getAnalytics={getAnalytics}
        getLearningWeights={getLearningWeights}
      />
    );
  }

  return (
    <LandingPage
      onConnectGmail={handleConnectGmail}
      onSetGoals={handleSetGoals}
      onDashboard={() => setCurrentPage('dashboard')}
      isConnected={isConnected}
    />
  );
}

export function AdaptiveGoalAgent() {
  return (
    <AgentProvider>
      <AdaptiveGoalAgentContent />
    </AgentProvider>
  );
}
