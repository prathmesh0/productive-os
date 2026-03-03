import React, { useState } from 'react';
import { Category, Task } from '@/lib/types';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Plus, X } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  defaultDate?: string;
  defaultStartTime?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd, onCancel, defaultDate, defaultStartTime }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [startTime, setStartTime] = useState(defaultStartTime || '09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reminderTime, setReminderTime] = useState(defaultStartTime || '08:45');
  const [recurring, setRecurring] = useState(false);
  const [date, setDate] = useState(defaultDate || formatDate(new Date()));

  const categories: Category[] = ['DSA', 'Jobs', 'Book', 'Learning', 'Insta', 'Personal'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAdd({
      title,
      category,
      startTime,
      endTime,
      reminderTime,
      recurring,
      date,
      completed: false
    });
    setTitle('');
    if (onCancel) onCancel();
  };

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-none border-none p-4">
      <CardContent className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <CardTitle className="text-xl">Create New Task</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Task Title</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "text-[10px] px-2 py-2 rounded-lg border font-bold uppercase transition-all",
                    category === cat ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-400 border-gray-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Time</label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">End Time</label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recurring"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
              Recurring Task (Daily)
            </label>
          </div>

          <div className="pt-4 flex gap-3">
             <Button variant="outline" className="flex-1 py-6" onClick={onCancel} type="button">Cancel</Button>
             <Button variant="primary" className="flex-1 py-6 shadow-lg shadow-blue-500/30" type="submit">
                <Plus className="w-4 h-4 mr-2" /> Create Task
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
