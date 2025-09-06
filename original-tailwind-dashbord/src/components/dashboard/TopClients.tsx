import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import type { TopClientMetric } from "../../container/analise/analyticsService";
import { Crown, Medal } from "lucide-react";


interface TopClientsProps {
    data: TopClientMetric[]; 
}

export function TopClients({ data }: TopClientsProps) {
  return (
    <Card className="bg-slate-900/20 backdrop-blur-lg border border-white/10 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 shadow-black/50 text-shadow">
          <Crown className="text-yellow-400" />
          Top Clientes
        </CardTitle>
        <CardDescription className="text-white/70 shadow-black/50 text-shadow-sm">
          Clientes com maior valor total de compras.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!data || data.length === 0 ? (
          <p className="text-center text-sm text-white/80 py-8">
            Nenhum dado de cliente para exibir.
          </p>
        ) : (
          <div className="space-y-6">
            {data.map((client) => {
              const initials = (client.nome ?? "").slice(0, 2).toUpperCase() || "CL";

              
              return (
                
                <div key={client.nome} className="flex items-center shadow-black/50 text-shadow">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={client.imagemUrl} alt={client.nome} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {client.nome}
                    </p>
                    <p className="text-xs text-muted-foreground text-white/60 shadow-black/50 text-shadow-sm">
                      Total: {(client.valor ?? 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-white shadow-black/50 text-shadow">
                    {(client.valor ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
