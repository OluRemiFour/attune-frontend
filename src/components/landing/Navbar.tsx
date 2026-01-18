import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onConnectGmail: () => void;
  onDashboard: () => void;
  isConnected?: boolean;
}

export function Navbar({ onConnectGmail, onDashboard, isConnected }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center pulse-glow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight text-xl">Attune</span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Demo
            </a>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected ? (
              <Button onClick={onDashboard} className="bg-white text-black hover:bg-white/90">
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={onConnectGmail} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25">
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-4">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                How It Works
              </a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Features
              </a>
              <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Demo
              </a>
              {isConnected ? (
                <Button onClick={onDashboard} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  Go to Dashboard
                </Button>
              ) : (
                <Button onClick={onConnectGmail} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
