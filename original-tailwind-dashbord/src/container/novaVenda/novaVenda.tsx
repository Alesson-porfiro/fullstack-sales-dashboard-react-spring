'use client';
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/AuthContext";
import type { Client } from "../clientes/clientesService";
import type { Product } from "../products/productsService";
import { fetchClients } from "../clientes/clientesService";
import { fetchProducts } from "../products/productsService";
import { createVenda } from "../vendas/vendaService";
import { PDFBuilder } from '../../lib/pdf-builder';
import { ClientSelector } from "../../components/vendas/ClientSelector";
import { ProductCatalog } from "../../components/vendas/ProductCatalog";
import { OrderSummary } from "../../components/vendas/OrderSummary";
import { Button } from "../../components/ui/button";

export interface CartItem extends Product {
  quantity: number;
}

export default function NovaVendaPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isProcessingSale, setIsProcessingSale] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [clientsData, productsData] = await Promise.all([
          fetchClients(),
          fetchProducts(),
        ]);
        setClients(clientsData);
        setProducts(productsData);
      } catch (error) {
        toast.error("Erro ao carregar dados para a venda.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const valorTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.preco * item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.codigo === product.codigo);
      if (existingItem) {
        return prevItems.map((item) =>
          item.codigo === product.codigo ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.codigo !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.codigo === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleCreateSale = async () => {
    if (!selectedClient) {
      toast.warning("Por favor, selecione um cliente.");
      return;
    }
    if (cartItems.length === 0) {
      toast.warning("O carrinho está vazio.");
      return;
    }
    const representanteId = auth.user?.userId;
    if (!representanteId) {
      toast.error("Não foi possível identificar o representante.");
      return;
    }

    setIsProcessingSale(true);
    toast.loading("Registrando venda no sistema...");

    try {
      const itensDaVenda = cartItems.map(item => ({
        produtoId: item.codigo,
        quantidade: item.quantity,
      }));

      await createVenda({
        clienteId: selectedClient.id,
        representanteId: representanteId,
        itens: itensDaVenda,
      });

      toast.success("Venda registrada! Gerando PDF...");

      const pdfBuilder = new PDFBuilder();
      await pdfBuilder.generate(
        selectedClient,
        auth.user?.name || 'N/A',
        cartItems,
        valorTotal
      );
      
      navigate("/dashboard/vendas");

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao registrar a venda.");
    } finally {
      setIsProcessingSale(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Registrar Nova Venda</h1>
          <p className="text-white/70">Monte o pedido selecionando o cliente e os produtos.</p>
        </div>
        <Button 
          onClick={handleCreateSale} 
          disabled={loading || isProcessingSale}
          className="bg-green-600 hover:bg-green-500 text-white"
        >
          {isProcessingSale ? 'Processando...' : 'Finalizar Venda'}
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-8">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <ClientSelector 
              representativeName={auth.user?.name || 'N/A'} 
              clients={clients}
              onClientSelect={setSelectedClient}
            />
          </div>
          <div className="lg:col-span-5">
            <ProductCatalog products={products} onAddToCart={handleAddToCart} />
          </div>
          <div className="lg:col-span-4">
            <OrderSummary 
              items={cartItems} 
              onUpdateQuantity={handleUpdateQuantity} 
              total={valorTotal}
            />
          </div>
        </div>
      )}
    </div>
  );
}