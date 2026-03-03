import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: string;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, value, icon: Icon, description, color = "text-blue-600", className 
}) => {
  return (
    <Card className={cn("border-none shadow-lg bg-white overflow-hidden", className)}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn("p-3 rounded-2xl bg-slate-50", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</div>
          <div className="text-xl font-black text-slate-900">{value}</div>
          {description && <div className="text-[10px] font-medium text-gray-400">{description}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
