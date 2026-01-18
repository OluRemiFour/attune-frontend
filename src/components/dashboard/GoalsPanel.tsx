import { useState } from 'react';
import { Target, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Goal } from '@/types/agent';

interface GoalsPanelProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onRemoveGoal: (goalId: string) => void;
}

const categoryColors: Record<Goal['category'], { bg: string; text: string; border: string }> = {
  productivity: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  focus: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  learning: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  health: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  custom: { bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10' },
};

const priorityColors: Record<Goal['priority'], { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
  low: { bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10' },
};

export function GoalsPanel({ goals, onAddGoal, onRemoveGoal }: GoalsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Omit<Goal, 'id' | 'createdAt'>>>({
    title: '',
    description: '',
    category: 'productivity',
    priority: 'medium',
    keywords: [],
    progress: 0,
  });
  const [keywordsInput, setKeywordsInput] = useState('');

  const handleAddGoal = () => {
    if (!newGoal.title) return;

    const keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k.length > 0);

    onAddGoal({
      title: newGoal.title!,
      description: newGoal.description || '',
      category: newGoal.category || 'custom',
      priority: newGoal.priority || 'medium',
      keywords,
      progress: newGoal.progress || 0,
    });

    // Reset form
    setNewGoal({
      title: '',
      description: '',
      category: 'productivity',
      priority: 'medium',
      keywords: [],
      progress: 0,
    });
    setKeywordsInput('');
    setIsDialogOpen(false);
  };

  return (
    <Card className="h-full flex flex-col bg-white/[0.03] border-white/10 backdrop-blur-xl overflow-hidden rounded-3xl">
      <CardHeader className="flex-shrink-0 pb-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Target className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-white tracking-tight">Active Goals</CardTitle>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">{goals.length} priority tracks</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-xl border-none shadow-lg shadow-purple-600/20 font-bold text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Define New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 font-body">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Title</label>
                  <Input
                    placeholder="e.g., Complete AI Project"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1.5 bg-white/5 border-white/10 text-white focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Description</label>
                  <Textarea
                    placeholder="What does this goal involve?"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1.5 bg-white/5 border-white/10 text-white focus:ring-purple-500"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Category</label>
                    <Select
                      value={newGoal.category}
                      onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value as Goal['category'] }))}
                    >
                      <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="focus">Focus</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Priority</label>
                    <Select
                      value={newGoal.priority}
                      onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value as Goal['priority'] }))}
                    >
                      <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Keywords</label>
                  <Input
                    placeholder="project, deadline, meeting (comma-separated)"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    className="mt-1.5 bg-white/5 border-white/10 text-white focus:ring-purple-500"
                  />
                  <p className="text-[10px] text-white/30 mt-2 font-mono italic">
                    Attune leverages these tokens for semantic alignment
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40 hover:text-white hover:bg-white/5">
                  Cancel
                </Button>
                <Button onClick={handleAddGoal} disabled={!newGoal.title} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Confirm Goal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0 scrollbar-hide">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-white/20 px-4">
            <Target className="h-10 w-10 mb-4 opacity-20" />
            <p className="text-sm font-medium">No tracking data</p>
            <p className="text-[11px] font-mono text-center">Add goals to calibrate neural prioritization</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {goals.map((goal) => {
              const category = categoryColors[goal.category];
              const priority = priorityColors[goal.priority];

              return (
                <div key={goal.id} className="p-5 hover:bg-white/[0.04] transition-all group border-b border-white/5 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-bold text-white truncate text-sm tracking-tight">{goal.title}</h4>
                        <Badge className={`${category.bg} ${category.text} border ${category.border} text-[9px] font-bold uppercase tracking-wider px-1.5 py-0`}>
                          {goal.category}
                        </Badge>
                        <Badge className={`${priority.bg} ${priority.text} border ${priority.border} text-[9px] font-bold uppercase tracking-wider px-1.5 py-0`}>
                          {goal.priority}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-[11px] text-white/40 mt-1 truncate font-medium">{goal.description}</p>
                      )}

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5 font-mono">
                          <span className="uppercase tracking-widest">Neural Convergence</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Keywords */}
                      {goal.keywords.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                          {goal.keywords.slice(0, 4).map((keyword) => (
                            <span
                              key={keyword}
                              className="text-[9px] font-bold font-mono bg-white/5 text-white/40 border border-white/5 px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                            >
                              {keyword}
                            </span>
                          ))}
                          {goal.keywords.length > 4 && (
                            <span className="text-[10px] text-white/20 font-mono">
                              +{goal.keywords.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white/20 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ml-2"
                      onClick={() => onRemoveGoal(goal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
