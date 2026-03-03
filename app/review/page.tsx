"use client";

import React, { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, getWeekRange } from '@/lib/utils';
import { db } from '@/firebase/config';
import { collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { WeeklyReview, Task } from '@/lib/types';
import { ClipboardCheck, Target, PencilLine, CheckCircle2, TrendingUp, Save, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewPage() {
  const [currentDate] = useState(formatDate(new Date()));
  const { tasks } = useTasks(currentDate);
  const [review, setReview] = useState<Partial<WeeklyReview>>({
    wordsWritten: 0,
    reflection: '',
  });
  const [lastReview, setLastReview] = useState<WeeklyReview | null>(null);
  const { start: weekStart, end: weekEnd } = getWeekRange(new Date());

  // Calculate current week stats
  const weeklyTasks = tasks.filter(t => t.date >= weekStart && t.date <= weekEnd);
  const coreCategories = ['DSA', 'Jobs', 'Book', 'Learning', 'Insta'];
  const coreTasks = weeklyTasks.filter(t => coreCategories.includes(t.category));
  const completedCore = coreTasks.filter(t => t.completed).length;
  
  const stats = {
    completed: weeklyTasks.filter(t => t.completed).length,
    dsa: weeklyTasks.filter(t => t.category === 'DSA' && t.completed).length,
    jobs: weeklyTasks.filter(t => t.category === 'Jobs' && t.completed).length,
    consistency: coreTasks.length > 0 ? Math.round((completedCore / coreTasks.length) * 100) : 0
  };

  useEffect(() => {
    const fetchLastReview = async () => {
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setLastReview(snapshot.docs[0].data() as WeeklyReview);
      }
    };
    fetchLastReview();
  }, []);

  const saveReview = async () => {
    const fullReview: Omit<WeeklyReview, 'id'> = {
      weekStarting: weekStart,
      tasksCompleted: stats.completed,
      dsaCount: stats.dsa,
      jobAppCount: stats.jobs,
      wordsWritten: review.wordsWritten || 0,
      consistency: stats.consistency,
      reflection: review.reflection || '',
      createdAt: Date.now()
    };
    await addDoc(collection(db, 'reviews'), fullReview);
    setLastReview(fullReview as WeeklyReview);
    alert("Weekly review saved successfully!");
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-blue-600 tracking-tight uppercase">Weekly Reflection</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{weekStart} — {weekEnd}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none bg-blue-600 text-white shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <TrendingUp className="w-6 h-6 mb-2 opacity-50" />
            <div className="text-3xl font-black">{stats.consistency}%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Core Consistency</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-emerald-500 text-white shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <CheckCircle2 className="w-6 h-6 mb-2 opacity-50" />
            <div className="text-3xl font-black">{stats.completed}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Tasks Finished</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-0 border-b border-slate-50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-orange-500" />
            <CardTitle className="text-xs uppercase tracking-widest font-black text-gray-400">Activity Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            <div className="p-6 flex justify-between items-center">
               <span className="text-sm font-bold text-slate-600">DSA Solved</span>
               <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black">{stats.dsa} Questions</span>
            </div>
            <div className="p-6 flex justify-between items-center">
               <span className="text-sm font-bold text-slate-600">Job Applications</span>
               <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black">{stats.jobs} Sent</span>
            </div>
            <div className="p-6 flex justify-between items-center">
               <span className="text-sm font-bold text-slate-600">Words Written</span>
               <input 
                 type="number" 
                 className="w-24 text-right border-none focus:ring-0 font-black text-blue-600" 
                 placeholder="Enter count"
                 value={review.wordsWritten}
                 onChange={(e) => setReview({...review, wordsWritten: parseInt(e.target.value) || 0})}
               />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <PencilLine className="w-4 h-4 text-purple-500" />
            <CardTitle className="text-xs uppercase tracking-widest font-black text-gray-400">Weekly Reflection</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
           <textarea 
             className="w-full min-h-[120px] bg-slate-50 rounded-2xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-purple-500/20 placeholder:italic"
             placeholder="What went well? What could be better? Any wins or lessons learned this week?"
             value={review.reflection}
             onChange={(e) => setReview({...review, reflection: e.target.value})}
           />
           <Button 
             className="w-full mt-6 py-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest flex gap-2 shadow-xl shadow-slate-900/20"
             onClick={saveReview}
           >
             <Save className="w-4 h-4" /> Finalize Review
           </Button>
        </CardContent>
      </Card>

      {lastReview && (
        <div className="pt-4">
           <div className="flex items-center gap-2 mb-4 px-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Previous Review Snapshot</h2>
           </div>
           <Card className="bg-slate-50 border-none rounded-3xl p-6">
              <p className="text-sm italic font-medium text-slate-600 leading-relaxed">"{lastReview.reflection}"</p>
              <div className="mt-4 flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Consistency: {lastReview.consistency}%</span>
                <span>DSA: {lastReview.dsaCount}</span>
                <span>Words: {lastReview.wordsWritten}</span>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
