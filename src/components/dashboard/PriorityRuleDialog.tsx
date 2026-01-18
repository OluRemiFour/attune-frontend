import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface PriorityRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'sender' | 'keyword';
  onAdd: (value: string) => void;
}

export function PriorityRuleDialog({ isOpen, onClose, type, onAdd }: PriorityRuleDialogProps) {
  const [value, setValue] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap and escape key handler
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        ref={dialogRef}
        className="relative z-50 w-full max-w-lg bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <h2 id="dialog-title" className="text-xl font-bold tracking-tight text-white">
            Add Priority {type === 'sender' ? 'Sender' : 'Keyword'}
          </h2>
          <p className="text-sm text-slate-400">
            {type === 'sender' 
              ? 'Add an email address to automatically prioritize messages from this sender.' 
              : 'Add a keyword to highlight messages containing this specific term.'}
          </p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) {
              onAdd(value.trim());
              setValue('');
              onClose();
            }
          }} 
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="value" className="text-sm font-medium text-white/60">
              {type === 'sender' ? 'Email Address' : 'Keyword or Phrase'}
            </Label>
            <Input
              id="value"
              placeholder={type === 'sender' ? 'boss@company.com' : 'Critical Project'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:ring-purple-500 rounded-xl h-12"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white/40 hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold h-12 px-8 rounded-xl"
            >
              Add Rule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
