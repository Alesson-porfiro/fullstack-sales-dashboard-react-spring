import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';


const chartConfig = {
  total: {
    label: "Receita",
    color: "hsl(var(--primary))", 
    
    valueFormatter: (value: number) => `R$${value.toLocaleString('pt-BR')}`,
  },
};

const chartData = [
  { month: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Fev', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Abr', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Mai', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Ago', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Set', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Out', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Dez', total: Math.floor(Math.random() * 5000) + 1000 },
];

export function OverviewChart() {
  return (
    
    <Card className="bg-slate-900/20 backdrop-blur-lg border border-white/10 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="text-white/70 text-3xl">Visão Geral</CardTitle>
        <CardDescription className="text-white/70 text-2xl">Receita total por mês neste ano</CardDescription>
      </CardHeader>
      <CardContent>
       
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                tickMargin={10} 
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                tickMargin={10} o
              />
              
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />} 
              />
              <Bar
                dataKey="total"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}