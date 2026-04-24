import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Filter,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ColumnDef } from '@tanstack/react-table';
import { useWebSocketMock } from '@/hooks/useWebSocketMock';
import { useUIStore } from '@/store/useUIStore';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTable } from '@/components/DataTable';

// --- Mock Data ---

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
  { name: 'Aug', value: 4000 },
  { name: 'Sep', value: 3000 },
  { name: 'Oct', value: 4500 },
  { name: 'Nov', value: 3900 },
  { name: 'Dec', value: 5200 },
];

const departmentData = [
  { name: 'Sales', value: 4500 },
  { name: 'Marketing', value: 3200 },
  { name: 'Product', value: 2800 },
  { name: 'Support', value: 2100 },
  { name: 'Eng', value: 4900 },
];

const pieData = [
  { name: 'Desktop', value: 400, color: 'var(--color-brand-500)' },
  { name: 'Mobile', value: 300, color: 'var(--color-brand-400)' },
  { name: 'Tablet', value: 200, color: 'var(--color-brand-300)' },
  { name: 'Others', value: 100, color: 'var(--color-brand-200)' },
];

const transactionData = Array.from({ length: 50 }).map((_, i) => ({
  id: `TRX-${1000 + i}`,
  date: '2024-03-' + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
  amount: Math.floor(Math.random() * 5000) + 100,
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
  customer: ['Alex Rivera', 'Jordan Smith', 'Sarah Chen', 'Michael Scott', 'Dwight Schrute'][Math.floor(Math.random() * 5)],
  category: ['Software', 'Hardware', 'Services', 'Subscriptions'][Math.floor(Math.random() * 4)],
}));

const transactionColumns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        className="rounded border-input text-primary focus:ring-primary/20"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        className="rounded border-input text-primary focus:ring-primary/20"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => <span className="font-mono font-medium">{row.getValue('id')}</span>
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <span className="font-medium">{formatCurrency(row.getValue('amount'))}</span>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span className={cn(
          "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
          status === 'completed' && "bg-emerald-100 text-emerald-700",
          status === 'pending' && "bg-amber-100 text-amber-700",
          status === 'failed' && "bg-rose-100 text-rose-700"
        )}>
          {status}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: () => (
      <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
        <MoreVertical size={16} />
      </button>
    )
  }
];

// --- Components ---

const StatCard = ({ title, value, change, icon: Icon, trend, cvId }: any) => {
  const { cvMode } = useUIStore();
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "bg-card p-6 rounded-2xl border border-border shadow-sm relative",
        cvMode && "cv-highlight"
      )}
    >
      {cvMode && (
        <div className="absolute -top-3 -right-3 z-10 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded font-bold">
          {cvId}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Icon size={24} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          trend === 'up' ? "text-emerald-500" : "text-rose-500"
        )}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h3 className="text-2xl font-heading font-bold mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

const DashboardHome: React.FC = () => {
  const liveMetrics = useWebSocketMock();
  const { cvMode } = useUIStore();
  const [drillDownData, setDrillDownData] = useState<any>(null);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(liveMetrics.revenue.value)} 
          change={liveMetrics.revenue.change} 
          icon={DollarSign} 
          trend="up"
          cvId="Animated Counters + WS Mock"
        />
        <StatCard 
          title="Active Users" 
          value={formatNumber(liveMetrics.activeNow.value)} 
          change={liveMetrics.activeNow.change} 
          icon={Users} 
          trend={liveMetrics.activeNow.change >= 0 ? 'up' : 'down'}
          cvId="Real-time WS Updates"
        />
        <StatCard 
          title="New Sales" 
          value={`+${formatNumber(liveMetrics.sales.value)}`} 
          change={liveMetrics.sales.change} 
          icon={TrendingUp} 
          trend="up"
          cvId="Framer Motion Transitions"
        />
        <StatCard 
          title="Activity Rate" 
          value="64.3%" 
          change={2.4} 
          icon={Activity} 
          trend="down"
          cvId="Micro-interactions"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Area Chart */}
        <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
          {cvMode && <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded z-10">Recharts Area (Gradient)</div>}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-heading font-bold">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly revenue growth performance</p>
            </div>
            <button className="p-2 hover:bg-muted rounded-lg border border-border">
              <Download size={16} />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar & Pie Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
          <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
            <h3 className="text-lg font-heading font-bold mb-6">Department Performance</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="var(--muted-foreground)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {departmentData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : 'var(--color-brand-300)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold">Traffic Source</h3>
              {cvMode && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded z-10">Click to Drill-down</span>}
            </div>
            <div className="flex items-center">
              <div className="h-[200px] w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      onClick={(data) => setDrillDownData(data)}
                      cursor="pointer"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Data Table */}
      <div className={cn("bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative", cvMode && "cv-highlight")}>
        {cvMode && <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded z-10">TanStack Table v8</div>}
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-bold">Recent Transactions</h3>
            <p className="text-sm text-muted-foreground">Manage and export your latest business transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-xl text-sm font-medium transition-all">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
        
        <DataTable columns={transactionColumns} data={transactionData} />
      </div>

      {/* Drill-down Modal Mock */}
      <AnimatePresence>
        {drillDownData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card w-full max-w-md p-6 rounded-3xl border border-border shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold">{drillDownData.name} Details</h3>
                <button onClick={() => setDrillDownData(null)} className="p-2 hover:bg-muted rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-2xl">
                  <p className="text-sm text-muted-foreground">Total Visitors</p>
                  <p className="text-3xl font-bold">{drillDownData.value}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-2xl">
                    <p className="text-xs text-muted-foreground">Bounce Rate</p>
                    <p className="text-lg font-bold">24.5%</p>
                  </div>
                  <div className="p-4 border border-border rounded-2xl">
                    <p className="text-xs text-muted-foreground">Avg. Session</p>
                    <p className="text-lg font-bold">04:22</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setDrillDownData(null)}
                className="w-full mt-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHome;
