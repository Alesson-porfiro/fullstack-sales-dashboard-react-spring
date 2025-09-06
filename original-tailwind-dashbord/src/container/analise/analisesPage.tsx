'use client';
import { useState, useEffect } from "react";
import { toast } from "sonner";


import { fetchDashboardAnalytics, type DashboardAnalytics } from "./analyticsService";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

export default function AnalisesPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await fetchDashboardAnalytics();
        setAnalytics(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao carregar análises.");
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return <p className="text-center py-12 text-cyan-400 animate-pulse">Carregando métricas...</p>;
  }

  if (!analytics) {
    return <p className="text-center py-12 text-red-400">Não foi possível carregar os dados.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Análises e Métricas
        </h1>
        <p className="text-white/70 mt-1">Uma visão detalhada do desempenho do seu negócio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card: Vendas por Representante */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 text-white shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">📊 Vendas por Representante</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics.vendasPorRepresentante}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="nome" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: 'none' }}
                  formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, "Total Vendido"]}
                />
                <Bar dataKey="valor" fill="url(#colorVenda)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorVenda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Cards de Métricas Rápidas */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-700/20 border border-cyan-400/30 text-white shadow-lg rounded-2xl">
            <CardHeader><CardTitle>🎯 Ticket Médio (30d)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-cyan-400">
                {analytics.ticketMedio.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-400/30 text-white shadow-lg rounded-2xl">
            <CardHeader><CardTitle>👥 Novos Clientes</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-emerald-400">
                +{analytics.novosClientesMes}
              </p>
            </CardContent>
          </Card>

          
          <Card className="bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-400/30 text-white shadow-lg rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>⚠️ Estoque Baixo ({analytics.produtosComEstoqueBaixo.length})</CardTitle>
                <span className="text-xs text-red-300">Abaixo de 5 unid.</span>
              </div>
            </CardHeader>
            <CardContent>
              {analytics.produtosComEstoqueBaixo.length > 0 ? (
                <div className="space-y-3">
                  
                  {analytics.produtosComEstoqueBaixo.map(product => (
                    <div key={product.codigo} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-md">
                          <AvatarImage src={product.imagemUrl} />
                          <AvatarFallback className="rounded-md bg-white/10 text-xs">
                            {product.nome.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{product.nome}</span>
                      </div>
                      <span className="font-bold text-red-400">{product.quantidade} unid.</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-emerald-400 text-sm py-4">Nenhum produto com estoque baixo!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Card: Produtos Mais Vendidos */}
        <Card className="lg:col-span-3 bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-white/10 text-white shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">🏆 Top 5 Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics.produtosMaisVendidos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="nome" stroke="#fff" width={140} fontSize={12} interval={0} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: 'none' }}
                  formatter={(val: number) => [`${val} unid.`, "Quantidade"]}
                />
                <Bar dataKey="valor" fill="url(#colorProduto)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="colorProduto" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}