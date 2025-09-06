'use client';
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Imports limpos e padronizados
import { fetchVendas, deleteVenda, updateVendaStatus, type Venda } from "./vendaService";
import { VendasTable } from "./vendasTable";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";

export default function VendasPage() {
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const navigate = useNavigate();

  // Estados para busca, paginação e ações
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vendaParaExcluir, setVendaParaExcluir] = useState<Venda | null>(null);
  const rowsPerPage = 8;

  useEffect(() => {
    loadVendas();
  }, []);

  async function loadVendas() {
    setLoading(true);
    try {
      const data = await fetchVendas();
      setVendas(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar vendas.");
    } finally {
      setLoading(false);
    }
  }

  // Lógica de filtro
  const filteredVendas = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return vendas;
    return vendas.filter(venda =>
      Object.values(venda).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [vendas, searchTerm]);

  // Lógica de paginação
  const currentVendas = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredVendas.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredVendas, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredVendas.length / rowsPerPage));

  // 2. FUNÇÕES PARA AS AÇÕES (UPDATE E DELETE)
  async function handleUpdateStatus(venda: Venda, status: Venda['status']) {
    // Atualiza a UI otimisticamente
    setVendas(vendas.map(v => v.id === venda.id ? { ...v, status } : v));
    try {
      await updateVendaStatus(venda.id, status);
      toast.success(`Status da venda #${venda.id} atualizado!`);
    } catch (error) {
      toast.error("Falha ao atualizar status.");
      // Reverte a mudança na UI em caso de erro
      loadVendas();
    }
  }

  async function handleDeleteConfirm() {
    if (!vendaParaExcluir) return;
    try {
      await deleteVenda(vendaParaExcluir.id);
      toast.success(`Venda #${vendaParaExcluir.id} excluída com sucesso!`);
      setVendas(vendas.filter(v => v.id !== vendaParaExcluir.id));
    } catch (error) {
      toast.error("Falha ao excluir a venda.");
    } finally {
      setVendaParaExcluir(null); 
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Catálogo de Vendas</h1>
          <p className="text-white/70">Acompanhe todas as vendas realizadas.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
            <Input
              type="text"
              placeholder="Pesquisar vendas..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-8 bg-white/10 text-white placeholder:text-white/60 border-white/20"
            />
          </div>
          <Button
            className="bg-white/10 hover:bg-white/20 text-white"
            onClick={() => navigate('/dashboard/vendas/nova')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Registrar Nova Venda
          </Button>
        </div>
      </div>

      <Card className="w-full bg-white/10 backdrop-blur-md border-none shadow-lg text-white">
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Carregando vendas...</p>
          ) : (
            // 3. PASSANDO AS FUNÇÕES DE AÇÃO PARA A TABELA
            <VendasTable 
              data={currentVendas} 
              onUpdateStatus={handleUpdateStatus}
              onDelete={(venda) => setVendaParaExcluir(venda)} 
            />
          )}
        </CardContent>
      </Card>
      
      {/* 4. DIÁLOGO DE CONFIRMAÇÃO PARA EXCLUSÃO */}
      <AlertDialog open={!!vendaParaExcluir} onOpenChange={() => setVendaParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A venda <strong>#{vendaParaExcluir?.id}</strong> do cliente <strong>{vendaParaExcluir?.nomeCliente}</strong> será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 text-white mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}