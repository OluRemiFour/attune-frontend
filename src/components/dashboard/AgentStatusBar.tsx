import { Zap, Focus, Bell, BellOff, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AgentStatusBarProps {
  userName: string;
  focusMode: boolean;
  isConnected: boolean;
  onToggleFocusMode: () => void;
  onDisconnect: () => void;
  onBackToLanding: () => void;
}

export function AgentStatusBar({
  userName,
  focusMode,
  isConnected,
  onToggleFocusMode,
  onDisconnect,
  onBackToLanding,
}: AgentStatusBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left: Logo & Agent status */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onBackToLanding}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center pulse-glow border border-white/10 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">Attune</span>
          </div>

          {/* Agent status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Focus mode toggle */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 hover:bg-white/[0.08] transition-colors group cursor-pointer" onClick={onToggleFocusMode}>
            {focusMode ? (
              <BellOff className="h-4 w-4 text-purple-400" />
            ) : (
              <Bell className="h-4 w-4 text-white/40 group-hover:text-white/60" />
            )}
            <span className="text-xs font-bold text-white/60 hidden lg:inline uppercase tracking-widest">
              Focus Mode
            </span>
            <Switch
              checked={focusMode}
              onCheckedChange={onToggleFocusMode}
              className="data-[state=checked]:bg-purple-600 h-5 w-9"
            />
          </div>

          <div className="h-8 w-px bg-white/5 mx-1 hidden sm:block" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-white/5">
                <Avatar className="h-8 w-8 ring-1 ring-white/10">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-white text-xs font-bold">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs font-bold text-white tracking-tight">
                    {userName}
                  </span>
                  <p className="text-[10px] text-white/30 font-mono">
                    {isConnected ? 'Sync Active' : 'Disconnected'}
                  </p>
                </div>
                <ChevronDown className="h-3 w-3 text-white/20 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/[0.03] backdrop-blur-3xl border-white/10 text-white">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="font-bold text-sm tracking-tight">{userName}</p>
                <p className="text-[10px] text-white/40 font-mono">
                  {isConnected ? 'Gmail Connected' : 'Gmail Not Connected'}
                </p>
              </div>
              <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                <User className="h-4 w-4 mr-2 opacity-60" />
                <span className="text-sm">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                <Settings className="h-4 w-4 mr-2 opacity-60" />
                <span className="text-sm">Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem 
                className="text-red-400 focus:text-red-400 hover:bg-red-400/5 focus:bg-red-400/5 cursor-pointer"
                onClick={onDisconnect}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm">Disconnect Gmail</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Focus mode banner */}
      {focusMode && (
        <div className="bg-gradient-to-r from-purple-600/80 to-indigo-600/80 backdrop-blur-md text-white border-y border-white/10 text-center py-2 text-xs font-medium tracking-tight">
          <span className="flex items-center justify-center gap-2">
            <Focus className="h-3.5 w-3.5 animate-pulse" />
            Focus Flow Active — Neural filters prioritizing critical signals only
          </span>
        </div>
      )}
    </header>
  );
}
