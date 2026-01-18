import { Shield, Zap, Target, Lock, Layers, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Contextual Reasoning',
    description: 'Not just keyword matching. Our agent understands the nuances of your work relationships and goals.',
    icon: Cpu,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    name: 'Privacy Focused',
    description: 'Your data never trains public models. Processing happens within your private cloud instance.',
    icon: Lock,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    name: 'Goal-Aligned',
    description: 'The agent priorities shift dynamically based on what you need to accomplish this week.',
    icon: Target,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    name: 'Feedback-Driven',
    description: 'Every interaction refines the scoring model. It gets smarter the more you use it.',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

export function WhyDifferentSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background/50 backdrop-blur-sm">
      {/* Decorative background gradients - Updated to match hero mixture */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[150px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Architecture</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Why Attune is{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent italic">
                Different.
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-xl text-white/60 leading-relaxed max-w-xl"
            >
              Generic AI looks for keywords. Attune understands context. 
              By mapping your goals to your communications, we ensure you never miss a needle in the haystack while processing the hay in the background.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 h-6 w-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                </div>
                <p className="text-white/80 font-medium">Explainable decisions for every priority score.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-6 w-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                </div>
                <p className="text-white/80 font-medium">Automatic goal derivation from calendar & documents.</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <BentoCard 
                key={feature.name}
                feature={feature} 
                delay={0.1 * i}
                className={i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ feature, className, delay }: { feature: typeof features[0], className?: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className={`relative group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:bg-white/[0.05] transition-all ${className}`}
    >
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.bg.includes('indigo') ? 'from-purple-500/20 to-indigo-500/20' : feature.bg.includes('green') ? 'from-green-500/20 to-cyan-500/20' : feature.bg.includes('purple') ? 'from-pink-500/20 to-purple-500/20' : 'from-amber-500/20 to-orange-500/20'} ${feature.color} border border-white/10 flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
        <feature.icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
      
      {/* Subtle hover decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Sparkles className="h-4 w-4 text-purple-300" />
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

