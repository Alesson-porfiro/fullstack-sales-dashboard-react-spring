'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DollarSign, Users, CreditCard, Activity } from "lucide-react";


import { OverviewChart } from "../components/dashboard/OverviewChart";
import { RecentSales } from "../components/dashboard/RecentSales";
import { StatsCard } from "../components/dashboard/StatsCard";
import { TopClients } from "../components/dashboard/TopClients";


import {
  fetchDashboardAnalytics,
  type DashboardAnalytics,
} from "../container/analise/analyticsService";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const receitaChartData = [{ value: 300 }, { value: 400 }, { value: 200 }, { value: 500 }, { value: 700 }, { value: 600 }];
  const vendasChartData = [{ value: 100 }, { value: 250 }, { value: 180 }, { value: 300 }, { value: 280 }, { value: 400 }];

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await fetchDashboardAnalytics();
        setAnalytics(data);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-12 text-white/80 animate-pulse">
        Carregando dashboard...
      </p>
    );
  }

  if (!analytics) {
    return (
      <p className="text-center py-12 text-red-400">
        Não foi possível carregar os dados do dashboard.
      </p>
    );
  }

  return (
    <>
      {/* PRIMEIRA LINHA - Cards + RecentSales lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-3">
          <StatsCard
            title="Total de Receita"
            value="R$ 45.231,89"
            description="+20.1% do último mês"
            icon={DollarSign}
            chartData={receitaChartData} 
            chartColor="#34d399" 
          />

          <StatsCard
            title="Novos Clientes (Mês)"
            value={`+${analytics.novosClientesMes ?? 0}`}
            description="Novos clientes este mês"
            icon={Users}
          />

          <StatsCard
            title="Vendas"
            value="+12.234"
            description="+19% do último mês"
            icon={CreditCard}
            chartData={vendasChartData} 
            chartColor="#60a5fa" 
          />

          <StatsCard
            title="Ticket Médio (Mês)"
            value={(analytics.ticketMedio ?? 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            description="Valor médio por venda"
            icon={Activity}
          />
        </div>

        
        <div className="lg:col-span-1">
          <RecentSales />
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-4">
          <OverviewChart />
        </div>

        <div className="lg:col-span-3 space-y-8">
          <TopClients data={analytics.topClientes ?? []} />
        </div>
      </div>
    </>
  );
}
