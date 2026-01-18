import { Github, Twitter, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center pulse-glow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white tracking-tight text-lg">Attune</p>
              <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Next-Gen Reasoner</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-white/30">
          <p className="mt-2">© {new Date().getFullYear()} Attune. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
