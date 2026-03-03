import { useMemo } from 'react';
import { Task, Category } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { subDays, eachDayOfInterval, format } from 'date-fns';

export function useAnalytics(tasks: Task[]) {
  const analyticsData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    const dailyPerformance = last7Days.map(day => {
      const dateStr = formatDate(day);
      const dayTasks = tasks.filter(t => t.date === dateStr);
      const completed = dayTasks.filter(t => t.completed).length;
      const total = dayTasks.length;
      return {
        name: format(day, 'EEE'),
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0
      };
    });

    const categoryStats = tasks.reduce((acc, task) => {
      if (task.completed) {
        acc[task.category] = (acc[task.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    const productivityScoreTrend = last7Days.map(day => {
        const dateStr = formatDate(day);
        const dayTasks = tasks.filter(t => t.date === dateStr);
        const completed = dayTasks.filter(t => t.completed).length;
        const total = dayTasks.length;
        // Basic score: (completed/total) * 100
        return {
          date: format(day, 'MM/dd'),
          score: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      });

    return { dailyPerformance, pieData, productivityScoreTrend };
  }, [tasks]);

  return analyticsData;
}
