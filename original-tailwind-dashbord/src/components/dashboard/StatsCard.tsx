import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { LucideIcon } from 'lucide-react'; 
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  
  chartData?: { value: number }[];
  chartColor?: string; 
}

export function StatsCard({ title, value, description, icon: Icon, chartData, chartColor = '#8884d8' }: StatsCardProps) {
  return (
    <Card className="bg-slate-900/20 backdrop-blur-lg border border-white/10 shadow-lg text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
        <Icon className="h-4 w-4 text-white/60" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          {/* Lado Esquerdo: Valor e Descrição */}
          <div>
            <div className="text-3xl font-bold shadow-black/50 text-shadow">{value}</div>
            <p className="text-xs text-white/70 shadow-black/50 text-shadow-sm">{description}</p>
          </div>

         
          {chartData && chartData.length > 0 && (
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2}
                    fill={`url(#color-${title})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}