import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  doc, 
  getDoc,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { Streak, Task } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { subDays } from 'date-fns';

export function useStreak(tasks: Task[]) {
  const [streak, setStreak] = useState<Streak>({ currentStreak: 0, longestStreak: 0, lastCompletedDate: '' });

  useEffect(() => {
    const fetchStreak = async () => {
      const docRef = doc(db, 'settings', 'streak');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStreak(docSnap.data() as Streak);
      }
    };
    fetchStreak();
  }, []);

  const evaluateStreak = async (date: string) => {
    // Only evaluate if not already evaluated for today
    if (streak.lastCompletedDate === date) return;

    const dayTasks = tasks.filter(t => t.date === date);
    const coreCategories = ['DSA', 'Jobs', 'Book', 'Learning', 'Insta'];
    const completedCoreCount = dayTasks.filter(t => t.completed && coreCategories.includes(t.category)).length;

    let newCurrentStreak = streak.currentStreak;
    let newLongestStreak = streak.longestStreak;

    if (completedCoreCount >= 3) {
      // Streak continues
      const yesterday = formatDate(subDays(new Date(date), 1));
      if (streak.lastCompletedDate === yesterday || streak.lastCompletedDate === '') {
        newCurrentStreak += 1;
      } else {
        // Streak was broken and this is first day back
        newCurrentStreak = 1;
      }
      if (newCurrentStreak > newLongestStreak) newLongestStreak = newCurrentStreak;
    } else {
      // Streak broken
      newCurrentStreak = 0;
    }

    const newStreak = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastCompletedDate: date
    };

    setStreak(newStreak);
    await setDoc(doc(db, 'settings', 'streak'), newStreak);
  };

  return { streak, evaluateStreak };
}
