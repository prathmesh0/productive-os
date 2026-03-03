import React from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircle2, Circle, Clock, Trash2, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const categoryColors: Record<string, string> = {
    DSA: 'bg-blue-100 text-blue-700',
    Jobs: 'bg-green-100 text-green-700',
    Book: 'bg-purple-100 text-purple-700',
    Learning: 'bg-orange-100 text-orange-700',
    Insta: 'bg-pink-100 text-pink-700',
    Personal: 'bg-gray-100 text-gray-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("mb-3 border-l-4", task.completed ? "opacity-60 border-l-gray-300" : "border-l-blue-500")}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onToggle(task.id, !task.completed)} className="text-blue-500 hover:scale-110 transition-transform">
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <div>
              <h4 className={cn("font-medium", task.completed && "line-through text-gray-400")}>{task.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider", categoryColors[task.category])}>
                  {task.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {task.startTime} - {task.endTime}
                </span>
                {task.recurring && <Repeat className="w-3 h-3 text-blue-400" />}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-gray-300 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
