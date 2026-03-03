'use client';

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useStreak } from '@/hooks/useStreak';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DashboardCard } from '@/components/DashboardCard';
import { formatDate, cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Zap,
  Flame,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function DashboardPage() {
  const [currentDate] = useState(formatDate(new Date()));
  const { tasks, filteredTasks, loading } = useTasks(currentDate);
  const { dailyPerformance, pieData, productivityScoreTrend } =
    useAnalytics(tasks);
  const { streak } = useStreak(tasks);

  const COLORS = [
    '#2563eb',
    '#10b981',
    '#a855f7',
    '#f97316',
    '#ec4899',
    '#64748b',
  ];

  const stats = [
    {
      label: 'Today Complete',
      value: `${filteredTasks.filter((t) => t.completed).length}/${filteredTasks.length}`,
      icon: Target,
      color: 'text-blue-600',
    },
    {
      label: 'Longest Streak',
      value: `${streak.longestStreak} Days`,
      icon: Flame,
      color: 'text-orange-600',
    },
    {
      label: 'Weekly Average',
      value: `${Math.round(dailyPerformance.reduce((acc, d) => acc + d.percentage, 0) / 7)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-blue-600 tracking-tight uppercase">
          Analytics Dashboard
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Real-time performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <DashboardCard
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main performance chart */}
      <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-xs uppercase tracking-widest font-black text-gray-400">
              7-Day Productivity Trend
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productivityScoreTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontWeight: 900,
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category distribution */}
        <Card className="border-none shadow-lg bg-white overflow-hidden rounded-3xl">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-4 h-4 text-purple-600" />
              <CardTitle className="text-xs uppercase tracking-widest font-black text-gray-400">
                Category Distribution
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Completion */}
        <Card className="border-none shadow-lg bg-white overflow-hidden rounded-3xl">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-xs uppercase tracking-widest font-black text-gray-400">
                Weekly Performance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar
                  dataKey="completed"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
