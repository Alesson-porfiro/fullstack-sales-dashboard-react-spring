// src/services/vendasService.ts

// 1. TIPOS E INTERFACES

/**
 * Representa o objeto de Venda como ele vem do back-end (DTO).
 */
export interface Venda {
  id: number;
  nomeCliente: string;
  empresaCliente: string;
   emailCliente: string; // 👈 Adicionado
  imagemUrlCliente?: string; // 👈 Adicionado
  nomeRepresentante: string;
  status: 'AGUARDANDO_PAGAMENTO' | 'EM_ROTA_DE_ENTREGA' | 'FINALIZADO' | 'CANCELADO';
  valorTotal: number;
  dataCriacao: string; // Vem como string no formato ISO (ex: "2025-09-03T18:30:00")
}


export interface CriarVendaRequest {
  clienteId: number;
  representanteId: number;
  valorTotal: number;
}



const API_URL = "http://localhost:8080/vendas";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}



export async function fetchVendas(): Promise<Venda[]> {
  const response = await fetch(`${API_URL}/list`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar o catálogo de vendas.");
  }
  return response.json();
}


export async function fetchRecentVendas(): Promise<Venda[]> {
  const response = await fetch(`${API_URL}/recent`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Erro ao buscar vendas recentes.");
  return response.json();
}


export async function createVenda(venda: CriarVendaRequest): Promise<Venda> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(venda),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao criar a venda.");
  }
  return response.json();
}


export async function updateVendaStatus(id: number, status: Venda['status']): Promise<Venda> {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar o status da venda.");
  }
  return response.json();
}


export async function deleteVenda(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir a venda.");
  }
}