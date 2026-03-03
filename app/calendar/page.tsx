"use client";

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { CalendarView } from '@/components/CalendarView';
import { TaskForm } from '@/components/TaskForm';
import { formatDate } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CalendarPage() {
  const [currentDate] = useState(formatDate(new Date()));
  const { filteredTasks, addTask, loading } = useTasks(currentDate);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const handleSlotClick = (time: string) => {
    setSelectedTime(time);
    setShowTaskForm(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">Today's Schedule</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" onClick={() => setShowTaskForm(true)} className="bg-blue-600 text-white rounded-full h-10 w-10 hover:bg-blue-700 hover:scale-110 shadow-lg shadow-blue-500/40">
             <Plus className="w-6 h-6" />
           </Button>
        </div>
      </div>

      <div className="relative">
        <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-sm py-3 mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-black uppercase tracking-widest text-gray-500">Vertical Time Grid</span>
        </div>

        {!loading ? (
          <CalendarView 
            tasks={filteredTasks} 
            onSlotClick={handleSlotClick} 
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400 italic font-medium border-2 border-dashed border-gray-100 rounded-xl">
             Loading your timeline...
          </div>
        )}
      </div>

      <div className="pt-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-blue-700 uppercase tracking-tight">Pro Tip</h4>
            <p className="text-xs font-medium text-blue-600/70 leading-relaxed mt-0.5">Click on any empty time slot in the grid to quickly schedule a task for that specific hour.</p>
          </div>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm 
          onAdd={addTask} 
          onCancel={() => { setShowTaskForm(false); setSelectedTime(undefined); }} 
          defaultStartTime={selectedTime}
        />
      )}
    </div>
  );
}
