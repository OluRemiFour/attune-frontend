import { Brain, Workflow, Cpu, Zap, TrendingUp, Sparkles, Eye, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const steps = [
  {
    name: 'Observe',
    description: 'Continuously monitors incoming signals from Gmail, Calendar, and Slack.',
    icon: Eye,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20'
  },
  {
    name: 'Contextualize',
    description: 'Maps senders to your relationships, active goals, and current focus state.',
    icon: Target,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    name: 'Reason',
    description: 'Uses advanced LLMs to evaluate urgency and relevance against your priorities.',
    icon: Brain,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20'
  },
  {
    name: 'Decide',
    description: 'Scores every item (0-100) and selects the optimal delivery tier.',
    icon: Sparkles,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    name: 'Act',
    description: 'Notifies immediately, batches for later, or archives silently.',
    icon: Zap,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  {
    name: 'Learn',
    description: 'Refines its reasoning model based on how you interact with its decisions.',
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 relative overflow-hidden" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono mb-6"
          >
            <Workflow className="h-3 w-3" />
            <span>Autonomous Intelligence Loop</span>
          </motion.div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A reasoning engine that{' '}
            <span className="gradient-text italic">never sleeps.</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/60 max-w-2xl mx-auto">
            Attune doesn't just filter; it understands. Our continuous agent loop 
            thinks, decides, and learns on your behalf in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Loop Visualization */}
          <div className="relative aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            {/* Background Rings */}
            <div className="absolute inset-0 border border-white/5 rounded-full" />
            <div className="absolute inset-12 border border-white/5 rounded-full" />
            <div className="absolute inset-24 border border-white/5 rounded-full" />
            
            {/* Orbiting Steps */}
            {steps.map((step, i) => {
              const angle = (i / steps.length) * Math.PI * 2;
              const radius = 160; 
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isActive = i === activeStep;

              return (
                <motion.div
                  key={step.name}
                  className="absolute"
                  animate={{
                    x, y,
                    scale: isActive ? 1.2 : 1,
                    opacity: isActive ? 1 : 0.4
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isActive 
                      ? `${step.bg} shadow-lg ${step.border}` 
                      : "bg-white/5 border border-white/10"
                  }`}>
                    <step.icon className={`h-6 w-6 ${isActive ? step.color : "text-white/40"}`} />
                  </div>
                </motion.div>
              );
            })}

            {/* Central Core */}
            <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-3xl border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full animate-flow pulse-glow opacity-30 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
              <Cpu className="h-10 w-10 text-white relative z-20" />
            </div>
          </div>

          {/* Step Details */}
          <div className="">
            {steps.map((step, i) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-3 rounded-3xl border transition-all duration-500 ${
                  i === activeStep 
                    ? `bg-white/5 ${step.border} scale-[1.02]` 
                    : "bg-transparent border-transparent opacity-40 grayscale"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 h-8 w-8 rounded-lg ${step.bg} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className={`h-4 w-4 ${step.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${i === activeStep ? "text-white" : "text-white/60"}`}>
                      {step.name}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
