"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { PlusCircle, Search } from "lucide-react";

import { fetchClients, deleteClient, type Client } from "./clientesService"; 
import { ClientsTable } from "./clientesTable"; // 
import ClientFormModal from "../../components/dashboard/ClientFormModal"; 

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6; // Você pode ajustar este número

  async function loadClients() {
    setLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.nome.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  
  // Calcula quais clientes mostrar na página atual
  const currentClients = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredClients.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredClients, currentPage]);

  // Calcula o total de páginas
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / rowsPerPage));

  const handleOpenModal = (client: Partial<Client> | null = null) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleSave = (savedClient: Client) => {
    if (editingClient?.id) {
      setClients(clients.map((c) => (c.id === savedClient.id ? savedClient : c)));
    } else {
      setClients([savedClient, ...clients]);
    }
    
    setCurrentPage(1); 
  };

  const handleDelete = async (client: Client) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${client.nome}?`)) return;
    try {
      await deleteClient(client.id);
      toast.success("Cliente excluído com sucesso!");
      const updatedClients = clients.filter((c) => c.id !== client.id);
      setClients(updatedClients);
      
      // Ajusta a página atual se a última linha da página foi excluída
      const lastPage = Math.max(1, Math.ceil((updatedClients.length) / rowsPerPage));
      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir cliente.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-white/70">Gerencie sua base de clientes.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
            <Input
              type="text"
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Volta para a primeira página ao pesquisar
              }}
              className="pl-8 bg-white/10 text-white placeholder:text-white/60 border-white/20"
            />
          </div>
          <Button
            className="bg-white/10 hover:bg-white/20 text-white"
            onClick={() => handleOpenModal(null)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
        </div>
      </div>

      <ClientFormModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  client={editingClient}
  onCreated={(newClient) => {
    setClients((prev) => [newClient, ...prev]);
    setCurrentPage(1); // volta para a primeira página
  }}
  onUpdated={(updatedClient) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
  }}
/>

      <Card className="w-full bg-white/10 backdrop-blur-md border-none shadow-lg text-white">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Carregando...</p>
          ) : (
            // Passa os clientes da página atual para a tabela
            <ClientsTable
              data={currentClients} 
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
      
      
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 text-white mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Anterior
          </Button>
          <span className="px-2 text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}