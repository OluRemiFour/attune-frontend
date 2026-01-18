import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PriorityRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'sender' | 'keyword';
  onAdd: (value: string) => void;
}

export function PriorityRuleDialog({ isOpen, onClose, type, onAdd }: PriorityRuleDialogProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
      onClose();
    }
  };

  const handleClose = () => {
    setValue(''); // Reset value on close
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Add Priority {type === 'sender' ? 'Sender' : 'Keyword'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
