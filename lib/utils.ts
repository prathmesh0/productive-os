import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

export function getWeekRange(date: Date): { start: string, end: string } {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1)); // Mon
  const end = new Date(start);
  end.setDate(end.getDate() + 6); // Sun
  return { start: formatDate(start), end: formatDate(end) };
}
