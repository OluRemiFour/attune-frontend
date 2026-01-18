import { ArrowRight, Mail, Shield, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Hero } from './AgentVisualization';

interface HeroSectionProps {
  onConnectGmail: () => void;
  onGetStarted: () => void;
}

export function HeroSection({ onConnectGmail, onGetStarted }: HeroSectionProps) {
  return (
    // <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
    //   {/* Background decoration */}
    //   <div className="absolute inset-0 overflow-hidden pointer-events-none">
    //     <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-3xl" />
    //     <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100/40 to-cyan-100/40 blur-3xl" />
    //   </div>

    //   <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
    //     <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
    //       {/* Left Content - Headline aligned left */}
    //       <div className="flex flex-col items-start text-left">
    //         <motion.div 
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5 }}
    //           className="mb-8 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
    //         >
    //           <Sparkles className="h-4 w-4" />
    //           <span>Agentic AI for Personal Productivity</span>
    //         </motion.div>

    //         <motion.h1 
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5, delay: 0.1 }}
    //           className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1]"
    //         >
    //           An AI that decides{' '}
    //           <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
    //             when you should be interrupted.
    //           </span>
    //         </motion.h1>

    //         <motion.p 
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5, delay: 0.2 }}
    //           className="mt-8 text-xl leading-8 text-slate-600 max-w-xl"
    //         >
    //           Not reminders. Not noise. Just the messages that matter.
    //           Your personal AI agent protects your focus time by reasoning about what truly matters.
    //         </motion.p>

    //         <motion.div 
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5, delay: 0.3 }}
    //           className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
    //         >
    //           <Button
    //             size="lg"
    //             className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.96] w-full sm:w-auto"
    //             onClick={onConnectGmail}
    //           >
    //             <Mail className="mr-2 h-5 w-5" />
    //             Connect Gmail
    //             <ArrowRight className="ml-2 h-5 w-5" />
    //           </Button>
    //           <Button
    //             variant="outline"
    //             size="lg"
    //             className="h-14 px-8 text-lg border-2 hover:bg-slate-50 transition-all active:scale-[0.96] w-full sm:w-auto"
    //             onClick={onGetStarted}
    //           >
    //             Set Your Goals
    //           </Button>
    //         </motion.div>

    //         <motion.div 
    //           initial={{ opacity: 0 }}
    //           animate={{ opacity: 1 }}
    //           transition={{ duration: 1, delay: 0.5 }}
    //           className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-500"
    //         >
    //           <div className="flex items-center gap-2">
    //             <Shield className="h-4 w-4 text-indigo-500" />
    //             <span>Read-only access</span>
    //           </div>
    //           <div className="flex items-center gap-2">
    //             <Zap className="h-4 w-4 text-indigo-500" />
    //             <span>Explainable decisions</span>
    //           </div>
    //         </motion.div>
    //       </div>

    //       {/* Right Visual - Visual Timeline */}
    //       <div className="relative">
    //         <motion.div
    //           initial={{ opacity: 0, scale: 0.95, x: 20 }}
    //           animate={{ opacity: 1, scale: 1, x: 0 }}
    //           transition={{ duration: 0.8, ease: "easeOut" }}
    //           className="relative z-10"
    //         >
    //           <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl overflow-hidden">
    //             <div className="space-y-6">
    //               <div className="flex items-center justify-between mb-8">
    //                 <h3 className="font-semibold text-slate-900">Priority Queue</h3>
    //                 <div className="flex gap-1.5">
    //                   <div className="h-2 w-2 rounded-full bg-red-400" />
    //                   <div className="h-2 w-2 rounded-full bg-yellow-400" />
    //                   <div className="h-2 w-2 rounded-full bg-green-400" />
    //                 </div>
    //               </div>

    //               <motion.div 
    //                 initial={{ x: 50, opacity: 0 }}
    //                 animate={{ x: 0, opacity: 1 }}
    //                 transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
    //                 className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100"
    //               >
    //                 <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold">92</div>
    //                 <div className="flex-1">
    //                   <div className="h-2.5 w-24 bg-slate-200 rounded-full mb-2" />
    //                   <div className="h-2 w-32 bg-slate-100 rounded-full" />
    //                 </div>
    //                 <div className="h-6 w-16 rounded-full bg-red-50 text-[10px] font-bold text-red-600 flex items-center justify-center">URGENT</div>
    //               </motion.div>

    //               <motion.div 
    //                 initial={{ x: 50, opacity: 0 }}
    //                 animate={{ x: 0, opacity: 1 }}
    //                 transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
    //                 className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl shadow-sm border border-slate-100"
    //               >
    //                 <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">58</div>
    //                 <div className="flex-1">
    //                   <div className="h-2.5 w-20 bg-slate-200 rounded-full mb-2" />
    //                   <div className="h-2 w-28 bg-slate-100 rounded-full" />
    //                 </div>
    //                 <div className="h-6 w-16 rounded-full bg-yellow-50 text-[10px] font-bold text-yellow-600 flex items-center justify-center">DELAYED</div>
    //               </motion.div>

    //               <motion.div 
    //                 initial={{ x: 50, opacity: 0 }}
    //                 animate={{ x: 0, opacity: 1 }}
    //                 transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
    //                 className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl shadow-sm border border-slate-100 opacity-60"
    //               >
    //                 <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">12</div>
    //                 <div className="flex-1">
    //                   <div className="h-2.5 w-16 bg-slate-200 rounded-full mb-2" />
    //                   <div className="h-2 w-24 bg-slate-100 rounded-full" />
    //                 </div>
    //                 <div className="h-6 w-16 rounded-full bg-slate-50 text-[10px] font-bold text-slate-400 flex items-center justify-center">IGNORED</div>
    //               </motion.div>
    //             </div>
    //           </div>

    //           <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
    //           <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-700" />
    //         </motion.div>
    //       </div>
    //     </div>
    //   </div>
    // </section>

    <Hero onGetStarted={onGetStarted} onLearnMore={onConnectGmail} />
  );
}

