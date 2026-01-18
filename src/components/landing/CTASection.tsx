import { Mail, Target, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onConnectGmail: () => void;
  onSetGoals: () => void;
}

export function CTASection({ onConnectGmail, onSetGoals }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500 blur-[150px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500 blur-[150px] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-indigo-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Start protecting your focus today</span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to take control of your attention?
          </h2>

          <p className="mt-6 text-lg text-slate-300">
            Connect your Gmail and set your goals. The agent will start learning
            your priorities immediately.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/10 transition-all hover:shadow-2xl hover:shadow-white/20"
              onClick={onConnectGmail}
            >
              <Mail className="mr-2 h-5 w-5" />
              Connect Gmail
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              onClick={onSetGoals}
            >
              <Target className="mr-2 h-5 w-5" />
              Set Your Goals
            </Button>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            Free to use • Read-only access • No spam, ever
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-16">
          {[
            { value: '5min', label: 'Average setup time' },
            { value: '45min', label: 'Focus time saved daily' },
            { value: '87%', label: 'Decision accuracy' },
            { value: '100%', label: 'Explainable decisions' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
