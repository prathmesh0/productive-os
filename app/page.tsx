"use client";

import React, { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useStreak } from '@/hooks/useStreak';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn, formatDate } from '@/lib/utils';
import { Plus, Flame, Zap, Moon, LayoutGrid, CheckCircle, ClipboardList, Briefcase, Home as HomeIcon } from 'lucide-react';
import { db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { NightPlan } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [currentDate] = useState(formatDate(new Date()));
  const { filteredTasks, addTask, updateTask, deleteTask, generateSuccessTemplate, loading } = useTasks(currentDate);
  const { streak, evaluateStreak } = useStreak(filteredTasks);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isWfo, setIsWfo] = useState(false);
  const [nightPlan, setNightPlan] = useState<NightPlan | null>(null);

  // Settings sync
  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'user');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsWfo(docSnap.data().mode === 'WFO');
      }
    };
    
    const fetchNightPlan = async () => {
        const docRef = doc(db, 'nightPlans', currentDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNightPlan(docSnap.data() as NightPlan);
        }
    };

    fetchSettings();
    fetchNightPlan();
  }, [currentDate]);

  const toggleMode = async () => {
    const newMode = !isWfo ? 'WFO' : 'WFH';
    setIsWfo(!isWfo);
    await setDoc(doc(db, 'settings', 'user'), { mode: newMode });
  };

  const handleNightPlanSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const plan = {
      date: currentDate,
      mit1: formData.get('mit1') as string,
      mit2: formData.get('mit2') as string,
      mit3: formData.get('mit3') as string,
      tomorrowFocus: formData.get('tomorrowFocus') as string,
      notes: formData.get('notes') as string,
      createdAt: Date.now()
    };
    await setDoc(doc(db, 'nightPlans', currentDate), plan);
    setNightPlan(plan as NightPlan);
  };

  useEffect(() => {
    if (filteredTasks.length > 0) {
      evaluateStreak(currentDate);
    }
  }, [filteredTasks, currentDate, evaluateStreak]);

  const productivityScore = filteredTasks.length > 0 
    ? Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">Productivity OS</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button 
          onClick={toggleMode}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md",
            isWfo ? "bg-orange-100 text-orange-600 ring-2 ring-orange-200" : "bg-blue-100 text-blue-600 ring-2 ring-blue-200"
          )}
        >
          {isWfo ? <Briefcase className="w-4 h-4" /> : <HomeIcon className="w-4 h-4" />}
          {isWfo ? 'WFO Mode' : 'WFH Mode'}
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-none shadow-orange-500/20 shadow-xl">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Flame className="w-8 h-8 mb-1 animate-pulse" />
            <span className="text-2xl font-black">{streak.currentStreak}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Day Streak</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-500/20 shadow-xl">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Zap className="w-8 h-8 mb-1" />
            <span className="text-2xl font-black">{productivityScore}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Score</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Action */}
      {filteredTasks.length === 0 && !loading && (
        <Button 
          variant="primary" 
          className="w-full py-12 flex-col gap-3 rounded-2xl bg-white border-2 border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 group transition-all"
          onClick={generateSuccessTemplate}
        >
          <Zap className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col">
            <span className="text-lg font-black uppercase tracking-tight">Generate Today's Success Template</span>
            <span className="text-xs font-medium text-blue-400">Creates your core daily routines automatically</span>
          </div>
        </Button>
      )}

      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-black uppercase tracking-tight text-gray-700">Daily Quests</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowTaskForm(true)} className="bg-blue-600 text-white rounded-full h-8 w-8 hover:bg-blue-700 hover:scale-110 shadow-lg shadow-blue-500/40">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={(id, completed) => updateTask(id, { completed })} 
                onDelete={deleteTask} 
              />
            ))}
          </AnimatePresence>
          {!loading && filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 italic text-sm font-medium border-2 border-dashed border-gray-100 rounded-xl">
              No tasks scheduled for today. Focus on rest or planning.
            </div>
          )}
        </div>
      </div>

      {/* Night Planning */}
      <div className="space-y-4 pt-4">
         <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-black uppercase tracking-tight text-gray-700">Night Planning</h2>
         </div>
         
         {!nightPlan ? (
           <Card className="border-2 border-indigo-100 shadow-none">
             <CardContent className="p-6">
               <form onSubmit={handleNightPlanSave} className="space-y-4">
                 <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">3 MITs for Tomorrow</label>
                      <input name="mit1" placeholder="MIT #1" className="w-full border-b py-2 focus:outline-none focus:border-indigo-500 text-sm font-medium" required />
                      <input name="mit2" placeholder="MIT #2" className="w-full border-b py-2 focus:outline-none focus:border-indigo-500 text-sm font-medium" />
                      <input name="mit3" placeholder="MIT #3" className="w-full border-b py-2 focus:outline-none focus:border-indigo-500 text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Tomorrow Focus</label>
                      <input name="tomorrowFocus" placeholder="One word or theme" className="w-full border-b py-2 focus:outline-none focus:border-indigo-500 text-sm font-medium" />
                    </div>
                 </div>
                 <Button type="submit" variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 font-bold uppercase tracking-widest py-6">
                    Save Tomorrow's Plan
                 </Button>
               </form>
             </CardContent>
           </Card>
         ) : (
           <Card className="bg-indigo-900 text-white border-none shadow-xl">
             <CardHeader className="p-4 pb-0">
               <CardTitle className="text-xs uppercase tracking-[0.2em] font-black opacity-60">Tomorrow's Roadmap</CardTitle>
             </CardHeader>
             <CardContent className="p-4 pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-2 py-0.5 bg-indigo-500/30 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-400/50">Focus</div>
                  <div className="font-black text-sm tracking-tight">{nightPlan.tomorrowFocus}</div>
                </div>
                <div className="space-y-2">
                  {[nightPlan.mit1, nightPlan.mit2, nightPlan.mit3].filter(Boolean).map((mit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black">{i+1}</div>
                      <div className="text-sm font-medium">{mit}</div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-white/50 hover:text-white hover:bg-white/10 text-[10px] font-bold uppercase" onClick={() => setNightPlan(null)}>Edit Plan</Button>
             </CardContent>
           </Card>
         )}
      </div>

      {showTaskForm && (
        <TaskForm 
          onAdd={addTask} 
          onCancel={() => setShowTaskForm(false)} 
        />
      )}
    </div>
  );
}
