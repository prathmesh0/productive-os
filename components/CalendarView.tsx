import React from 'react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/Card';
import { Clock } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onSlotClick: (time: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSlotClick }) => {
  const hours = Array.from({ length: 19 }, (_, i) => i + 6); // 6 AM to 12 AM

  const getPosition = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const top = (h - 6) * 60 + m;
    return top;
  };

  const getHeight = (start: string, end: string) => {
    const startPos = getPosition(start);
    const endPos = getPosition(end);
    return Math.max(30, endPos - startPos); // Minimum height 30px
  };

  const categoryColors: Record<string, string> = {
    DSA: 'bg-blue-500 text-white border-blue-600',
    Jobs: 'bg-green-500 text-white border-green-600',
    Book: 'bg-purple-500 text-white border-purple-600',
    Learning: 'bg-orange-500 text-white border-orange-600',
    Insta: 'bg-pink-500 text-white border-pink-600',
    Personal: 'bg-gray-500 text-white border-gray-600'
  };

  return (
    <div className="relative border rounded-xl bg-white overflow-hidden select-none">
      <div className="grid grid-cols-[60px_1fr] relative">
        {/* Time labels */}
        <div className="border-r bg-gray-50/50">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b text-[10px] text-gray-400 font-bold uppercase tracking-tighter flex items-start justify-center pt-2">
              {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="relative bg-white/20">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b border-gray-100 cursor-pointer hover:bg-blue-50/30 transition-colors" onClick={() => onSlotClick(`${hour.toString().padStart(2, '0')}:00`)} />
          ))}

          {/* Tasks overlay */}
          {tasks.map((task) => {
             const top = getPosition(task.startTime);
             const height = getHeight(task.startTime, task.endTime);
             
             return (
               <div
                 key={task.id}
                 className={cn(
                   "absolute left-1 right-1 rounded-md border shadow-sm p-2 overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer",
                   categoryColors[task.category],
                   task.completed && "opacity-60 saturate-50"
                 )}
                 style={{ top: `${top}px`, height: `${height}px` }}
               >
                 <div className="text-[10px] font-bold truncate">{task.title}</div>
                 <div className="text-[8px] opacity-80 flex items-center gap-0.5 mt-0.5">
                   <Clock className="w-2 h-2" /> {task.startTime} - {task.endTime}
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};
