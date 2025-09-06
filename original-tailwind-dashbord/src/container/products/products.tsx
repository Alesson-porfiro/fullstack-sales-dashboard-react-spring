import React, { useState, useEffect, useMemo } from "react";
import { ProductsTable } from "./productsTable";
import type { Product } from "./productsService";
import { fetchProducts, deleteProduct } from "./productsService";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import ProductFormModal from "../../components/dashboard/ProductFormModal";

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // 🔄 Carregar produtos do backend
  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setRows(data);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrar produtos pelo termo de pesquisa (nome, descrição, marca, situação)
  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return rows.filter((product) => {
      return (
        product.nome.toLowerCase().includes(term) ||
        product.descricao.toLowerCase().includes(term) ||
        product.marca.toLowerCase().includes(term) ||
        (product.situacao ?? (product.ativo ? "ativo" : "inativo"))
          .toLowerCase()
          .includes(term)
      );
    });
  }, [rows, searchTerm]);

  // Produtos da página atual (após filtro)
  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredRows, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  // Criar produto
  function handleProductCreated(newProduct: Product) {
    setRows((prev) => [newProduct, ...prev]);
    setCurrentPage(1);
  }

  // Editar produto
  function handleEdit(row: Product) {
    setEditingProduct(row);
    setModalOpen(true);
  }

  // Excluir produto
  async function handleDelete(row: Product) {
    try {
      await deleteProduct(row.codigo);
      toast.success(`Produto excluído: ${row.nome}`);
      setRows((prev) => prev.filter((p) => p.codigo !== row.codigo));

      // Ajusta página se necessário
      const lastPage = Math.max(
        1,
        Math.ceil((filteredRows.length - 1) / rowsPerPage)
      );
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir produto");
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-white/70">Gerencie seu catálogo de produtos.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
            className="p-2 rounded bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
          <Button
            className="bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            onClick={() => {
              setEditingProduct(null); 
              setModalOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        </div>
      </div>

      {/* Modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onCreated={handleProductCreated}
        onUpdated={(updatedProduct) => {
          setRows((prev) =>
            prev.map((p) =>
              p.codigo === updatedProduct.codigo ? updatedProduct : p
            )
          );
          toast.success(`Produto atualizado: ${updatedProduct.nome}`);
        }}
      />

      {/* Tabela de produtos */}
      <ProductsTable
        data={currentRows}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Lista de Produtos"
      />

      {/* Controles de Paginação */}
      {filteredRows.length > rowsPerPage && (
        <div className="flex justify-end items-center space-x-2 text-white mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Anterior
          </Button>
          <span className="px-2">
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
