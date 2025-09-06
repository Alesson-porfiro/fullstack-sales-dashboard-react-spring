import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Venda } from "./vendaService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "../../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";


const getStatusVariant = (status: Venda["status"]) => {
  switch (status) {
    case "FINALIZADO": return { variant: "default", className: "bg-green-600 border-none", text: "Finalizado" };
    case "EM_ROTA_DE_ENTREGA": return { variant: "secondary", className: "bg-yellow-500 border-none text-black", text: "Em Rota" };
    case "CANCELADO": return { variant: "destructive", className: "border-none", text: "Cancelado" };
    default: return { variant: "outline", className: "border-white/50", text: "Aguardando Pag." };
  }
};

// 👇 1. Adicione as props onUpdateStatus e onDelete
interface VendasTableProps {
  data: Venda[];
  onUpdateStatus: (venda: Venda, status: Venda['status']) => void;
  onDelete: (venda: Venda) => void;
}

export function VendasTable({ data, onUpdateStatus, onDelete }: VendasTableProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-none shadow-lg text-white">
      <CardHeader>
        <CardTitle>Histórico de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 hover:bg-white/10">
              <TableHead className="text-white">ID</TableHead>
              <TableHead className="text-white">Cliente</TableHead>
              <TableHead className="text-white hidden md:table-cell">Empresa</TableHead>
              <TableHead className="text-white hidden sm:table-cell">Representante</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Valor Total</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead> {/* 👈 Coluna adicionada */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Nenhuma venda encontrada.</TableCell></TableRow>
            ) : (
              data.map((venda) => {
                const statusInfo = getStatusVariant(venda.status);
                return (
                  <TableRow key={venda.id} className="border-white/10">
                    <TableCell>{venda.id}</TableCell>
                    <TableCell className="font-medium text-white">{venda.nomeCliente}</TableCell>
                    <TableCell className="hidden md:table-cell text-white/80">{venda.empresaCliente}</TableCell>
                    <TableCell className="hidden sm:table-cell text-white/80">{venda.nomeRepresentante}</TableCell>
                    <TableCell><Badge variant={statusInfo.variant} className={statusInfo.className}>{statusInfo.text}</Badge></TableCell>
                    <TableCell className="text-right font-medium">
                      {venda.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </TableCell>
                    {/* 👇 2. Célula de Ações com DropdownMenu */}
                    <TableCell className="text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="h-8 w-8 p-0 text-white/90 hover:text-white hover:bg-white/20">
                             <span className="sr-only">Abrir menu</span>
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Ações</DropdownMenuLabel>
                           <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Pencil className="mr-2 h-4 w-4" /> Alterar Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={() => onUpdateStatus(venda, 'AGUARDANDO_PAGAMENTO')}>Aguardando Pagamento</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onUpdateStatus(venda, 'EM_ROTA_DE_ENTREGA')}>Em Rota de Entrega</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onUpdateStatus(venda, 'FINALIZADO')}>Finalizado</DropdownMenuItem>
                              </DropdownMenuSubContent>
                           </DropdownMenuSub>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem onSelect={() => onDelete(venda)} className="text-red-400">
                             <Trash2 className="mr-2 h-4 w-4" /> Excluir
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}