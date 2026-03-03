import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/firebase/config';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  where, 
  orderBy, 
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { Task, Category } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { addDays } from 'date-fns';

export function useTasks(currentDate: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync tasks from firestore
  useEffect(() => {
    // Only fetch tasks within a reasonable range (or just all tasks for simplicity as it is single user)
    const q = query(
      collection(db, 'tasks'),
      orderBy('startTime', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList: Task[] = [];
      snapshot.forEach((doc) => {
        taskList.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => task.date === currentDate);
  }, [tasks, currentDate]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: Date.now(),
      });
      return docRef.id;
    } catch (e) {
      console.error("Error adding task: ", e);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const docRef = doc(db, 'tasks', id);
      await updateDoc(docRef, updates);

      // Recurring logic: when a task is completed, if recurring = true, create next day task
      if (updates.completed === true) {
        const task = tasks.find(t => t.id === id);
        if (task && task.recurring) {
          const nextDay = addDays(new Date(task.date), 1);
          const nextDayDate = formatDate(nextDay);
          
          // Check if next day task already exists (prevent infinite)
          const alreadyExists = tasks.some(t => t.title === task.title && t.date === nextDayDate);
          
          if (!alreadyExists) {
            await addTask({
              ...task,
              date: nextDayDate,
              completed: false,
              parentId: task.id
            } as Omit<Task, 'id' | 'createdAt'>);
          }
        }
      }
    } catch (e) {
      console.error("Error updating task: ", e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  };

  const generateSuccessTemplate = async () => {
    const coreTasks = [
      { title: 'Solve 3 DSA Questions', category: 'DSA' as Category, startTime: '09:00', endTime: '11:00', recurring: true },
      { title: 'Apply to 10 Companies', category: 'Jobs' as Category, startTime: '11:00', endTime: '13:00', recurring: true },
      { title: 'Write 800 Words', category: 'Book' as Category, startTime: '14:00', endTime: '15:30', recurring: true },
      { title: 'Post Book Launch Content', category: 'Insta' as Category, startTime: '16:00', endTime: '16:30', recurring: true },
      { title: 'Learn 1 Dev Concept', category: 'Learning' as Category, startTime: '17:00', endTime: '18:00', recurring: true }
    ];

    const todayDate = formatDate(new Date());

    for (const core of coreTasks) {
      const exists = tasks.some(t => t.title === core.title && t.date === todayDate);
      if (!exists) {
        await addTask({
          ...core,
          date: todayDate,
          completed: false,
          reminderTime: core.startTime,
        });
      }
    }
  };

  return { 
    tasks, 
    filteredTasks, 
    loading, 
    addTask, 
    updateTask, 
    deleteTask, 
    generateSuccessTemplate 
  };
}
