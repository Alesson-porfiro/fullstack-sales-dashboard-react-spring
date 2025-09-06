import { useState, useEffect } from 'react';
import { toast } from 'sonner';


import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { fetchRecentVendas, type Venda } from "../../container/novaVenda/novaVendaService";

export function RecentSales() {
  const [sales, setSales] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentSales() {
      try {
        
        const recentSalesData = await fetchRecentVendas();
        setSales(recentSalesData);
      } catch (error) {
        toast.error("Erro ao carregar vendas recentes.");
      } finally {
        setLoading(false);
      }
    }
    loadRecentSales();
  }, []);

  return (
    <Card className="bg-slate-900/20 backdrop-blur-lg border border-white/10 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="text-white shadow-black/50 text-shadow">Vendas Recentes</CardTitle>
        <CardDescription className="text-white/70 shadow-black/50 text-shadow-sm">As últimas 5 vendas realizadas.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-sm text-white/80 py-8">Carregando...</p>
        ) : sales.length === 0 ? (
          <p className="text-center text-sm text-white/80 py-8">Nenhuma venda recente encontrada.</p>
        ) : (
          <div className="space-y-6">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center">
                <Avatar className="h-10 w-10">
                  
                  <AvatarImage src={sale.imagemUrlCliente} alt={sale.nomeCliente} />
                  <AvatarFallback>{sale.nomeCliente.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="shadow-black/50 text-shadow  font-medium leading-none text-white">{sale.nomeCliente}</p>
                   
                  <p className="shadow-black/50 text-shadow-sm  text-muted-foreground text-white/70">{sale.emailCliente}</p>
                </div>
                <div className="shadow-black/50 text-shadow ml-auto font-medium text-white">
                  {sale.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}