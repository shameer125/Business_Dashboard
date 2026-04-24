import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar
} from 'recharts';
import { Calendar as CalendarIcon, Download, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', sessions: 4000, revenue: 2400, conversions: 400 },
  { name: 'Tue', sessions: 3000, revenue: 1398, conversions: 300 },
  { name: 'Wed', sessions: 2000, revenue: 9800, conversions: 200 },
  { name: 'Thu', sessions: 2780, revenue: 3908, conversions: 278 },
  { name: 'Fri', sessions: 1890, revenue: 4800, conversions: 189 },
  { name: 'Sat', sessions: 2390, revenue: 3800, conversions: 239 },
  { name: 'Sun', sessions: 3490, revenue: 4300, conversions: 349 },
];

const AnalyticsPage: React.FC = () => {
  const { cvMode } = useUIStore();
  const [dateRange, setDateRange] = useState('Last 7 Days');

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your application performance and revenue metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border border-border rounded-xl px-3 py-2">
            <CalendarIcon size={16} className="text-muted-foreground mr-2" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <button className="p-2 hover:bg-muted border border-border rounded-xl">
            <Filter size={18} />
          </button>
          <button className="p-2 hover:bg-muted border border-border rounded-xl">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Dual Y-Axis Chart */}
        <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
          {cvMode && <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded z-10">Dual Y-Axis Composed Chart</div>}
          <h3 className="text-lg font-heading font-bold mb-8">Revenue vs Conversions</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                <Legend verticalAlign="top" height={36}/>
                <Area yAxisId="left" type="monotone" dataKey="revenue" fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth={2} />
                <Bar yAxisId="left" dataKey="sessions" barSize={20} fill="var(--color-brand-300)" opacity={0.5} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Heatmap Mock */}
          <div className={cn("lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
            {cvMode && <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded z-10">Activity Heatmap</div>}
            <h3 className="text-lg font-heading font-bold mb-6">User Activity Heatmap</h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = Math.floor(Math.random() * 5);
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-square rounded-md transition-all cursor-pointer hover:ring-2 hover:ring-primary/50",
                      intensity === 0 && "bg-muted/30",
                      intensity === 1 && "bg-primary/20",
                      intensity === 2 && "bg-primary/40",
                      intensity === 3 && "bg-primary/60",
                      intensity === 4 && "bg-primary/90",
                    )}
                    title={`Intensity: ${intensity}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
              <span>Less</span>
              <div className="w-3 h-3 bg-muted/30 rounded-sm" />
              <div className="w-3 h-3 bg-primary/20 rounded-sm" />
              <div className="w-3 h-3 bg-primary/60 rounded-sm" />
              <div className="w-3 h-3 bg-primary/90 rounded-sm" />
              <span>More</span>
            </div>
          </div>

          {/* Funnel Chart Mock */}
          <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
             {cvMode && <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded z-10">Conversion Funnel</div>}
             <h3 className="text-lg font-heading font-bold mb-6">Conversion Funnel</h3>
             <div className="space-y-4">
                {[
                  { label: 'Awareness', value: 100, color: 'var(--primary)' },
                  { label: 'Interest', value: 75, color: 'var(--primary)' },
                  { label: 'Desire', value: 45, color: 'var(--primary)' },
                  { label: 'Action', value: 12, color: 'var(--primary)' },
                ].map((step, i) => (
                  <div key={step.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>{step.label}</span>
                      <span className="text-muted-foreground">{step.value}%</span>
                    </div>
                    <div className="h-4 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${step.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: step.color, opacity: 1 - (i * 0.2) }}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
