"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { PlusCircle, Search } from "lucide-react";


import { fetchTeam, deleteMember, type TeamRow } from "./representanteService";
import { TeamTable } from "./TeamTable";
import TeamFormModal from "../../components/dashboard/TeamFormModal";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";


type SortConfig = {
  key: keyof TeamRow;
  direction: "ascending" | "descending";
} | null;

export default function MinhaEquipePage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamRow> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    async function loadTeam() {
      setLoading(true);
      try {
        const data = await fetchTeam();
        setRows(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao carregar equipe.");
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  //Ordenação
  const sortedRows = useMemo(() => {
    let sortableRows = [...rows];
    if (sortConfig !== null) {
      sortableRows.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableRows;
  }, [rows, sortConfig]);

  //Filtro
  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return sortedRows;
    return sortedRows.filter(
      (row) =>
        row.nome.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.cargo.toLowerCase().includes(term)
    );
  }, [sortedRows, searchTerm]);

  //Paginação
  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredRows, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  //Controle de ordenação
  const requestSort = (key: keyof TeamRow) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  //Abrir modal
  const handleOpenModal = (member: Partial<TeamRow> | null = null) => {
    setEditingMember(member);
    setModalOpen(true);
  };

  // Salvar (criar ou editar)
  const handleSave = (savedMember: TeamRow) => {
    if (editingMember?.id) {
      setRows(rows.map((r) => (r.id === savedMember.id ? savedMember : r)));
    } else {
      setRows([savedMember, ...rows]);
    }
  };

  // Deletar
  const handleDelete = async (row: TeamRow) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${row.nome}?`)) return;
    try {
      await deleteMember(row.id);
      toast.success("Membro excluído com sucesso!");
      setRows(rows.filter((r) => r.id !== row.id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir membro.");
    }
  };

  return (
    <div className="space-y-6">
      {/*Barra de busca + botão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Minha Equipe</h1>
          <p className="text-white/70">Gerencie seus representantes de vendas.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
            <Input
              type="text"
              placeholder="Pesquisar na equipe..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 bg-white/10 text-white placeholder:text-white/60 border-white/20"
            />
          </div>
          <Button
            className="bg-white/10 hover:bg-white/20 text-white"
            onClick={() => handleOpenModal(null)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Membro
          </Button>
        </div>
      </div>

      {/* Modal de criação/edição */}
      <TeamFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        member={editingMember}
      />

      {/*Tabela */}
      <Card className="w-full bg-white/10 backdrop-blur-md border-none shadow-lg text-white">
        <CardHeader>
          <CardTitle>Lista de Representantes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Carregando...</p>
          ) : (
            <TeamTable
              data={currentRows}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onSort={requestSort}
              sortConfig={sortConfig}
            />
          )}
        </CardContent>
      </Card>

      {/*Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 text-white mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
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
