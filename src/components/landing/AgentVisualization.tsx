"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight, Brain, Sparkles, Shield, Zap, Eye, Target, TrendingUp, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function Hero({ onGetStarted, onLearnMore }: HeroProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const agentSteps = ["Observe", "Context", "Reason", "Decide", "Act", "Learn"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % agentSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  AI-Powered Productivity
                </Badge>
                <Badge variant="outline" className="border-white/10 text-white/60">
                  v2.0
                </Badge>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-white">Your AI agent that</span>
                <br />
                <span className="gradient-text">protects your focus</span>
              </h1>

              <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
                Attune autonomously manages your inbox with adaptive reasoning, 
                learning your priorities and protecting what matters most — your time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-[1.02]"
                  onClick={onGetStarted}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Connect Gmail
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-medium border-white/10 text-white hover:bg-white/5 transition-all"
                  onClick={onLearnMore}
                >
                  See How It Works
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-white font-mono">8.5hrs</p>
                  <p className="text-sm text-white/50">Saved weekly</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-white font-mono">94%</p>
                  <p className="text-sm text-white/50">Accuracy</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-white font-mono">2.5k+</p>
                  <p className="text-sm text-white/50">Users</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Agent Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative"
            >
              <AgentVisualization currentStep={currentStep} agentSteps={agentSteps} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById('how-it-works');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-2xl"
          aria-label="Scroll to explore"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">Scroll to explore</span>
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
              <ChevronDown className="w-5 h-5 text-purple-400" />
            </div>
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}

function AgentVisualization({ currentStep, agentSteps }: { currentStep: number; agentSteps: string[] }) {
  const stepIcons = [Eye, Target, Brain, Sparkles, Zap, TrendingUp];
  const stepColors = [
    "from-cyan-400 to-cyan-500",
    "from-purple-400 to-purple-500",
    "from-pink-400 to-pink-500",
    "from-amber-400 to-amber-500",
    "from-green-400 to-green-500",
    "from-blue-400 to-blue-500"
  ];

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 opacity-50" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center pulse-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Attune</h3>
              <p className="text-sm text-white/50">Real-time processing</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            Active
          </Badge>
        </div>

        {/* Agent Loop */}
        <div className="grid grid-cols-6 gap-3 mb-8">
          {agentSteps.map((step, index) => {
            const Icon = stepIcons[index];
            const isActive = index === currentStep;
            const isPast = index < currentStep;
            
            return (
              <motion.div
                key={step}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: isActive ? 1 : isPast ? 0.7 : 0.4
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? `bg-gradient-to-br ${stepColors[index]} shadow-lg` 
                    : "bg-white/5 border border-white/10"
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-white/50"}`} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-white" : "text-white/40"}`}>
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Processing Animation */}
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-8">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500"
            animate={{
              width: ["0%", "100%"],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Sample Email Processing */}
        <div className="space-y-3">
          <EmailProcessingItem 
            subject="Q4 Budget Review - Urgent"
            sender="Sarah Chen (CFO)"
            priority={92}
            tier="immediate"
            isProcessing={currentStep === 3}
          />
          <EmailProcessingItem 
            subject="Weekly Newsletter"
            sender="Marketing Team"
            priority={35}
            tier="batch"
            isProcessing={false}
          />
          <EmailProcessingItem 
            subject="Project Update"
            sender="Mike R."
            priority={68}
            tier="delay"
            isProcessing={false}
          />
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 backdrop-blur-sm border border-purple-500/20 flex items-center justify-center"
      >
        <Shield className="w-10 h-10 text-purple-300" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center"
      >
        <Zap className="w-8 h-8 text-cyan-300" />
      </motion.div>
    </div>
  );
}

function EmailProcessingItem({ 
  subject, 
  sender, 
  priority, 
  tier,
  isProcessing 
}: { 
  subject: string; 
  sender: string; 
  priority: number;
  tier: "immediate" | "delay" | "batch";
  isProcessing: boolean;
}) {
  const tierStyles = {
    immediate: "border-red-500/30 bg-red-500/10",
    delay: "border-amber-500/30 bg-amber-500/10",
    batch: "border-green-500/30 bg-green-500/10"
  };

  const tierLabels = {
    immediate: { text: "Immediate", color: "text-red-400" },
    delay: { text: "Delay", color: "text-amber-400" },
    batch: { text: "Batch", color: "text-green-400" }
  };

  return (
    <motion.div
      animate={isProcessing ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        isProcessing 
          ? "border-purple-500/50 bg-purple-500/10" 
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{subject}</p>
        <p className="text-xs text-white/40">{sender}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-mono font-bold text-white">{priority}</span>
        <Badge className={`text-[10px] ${tierStyles[tier]}`}>
          <span className={tierLabels[tier].color}>{tierLabels[tier].text}</span>
        </Badge>
      </div>
    </motion.div>
  );
}
