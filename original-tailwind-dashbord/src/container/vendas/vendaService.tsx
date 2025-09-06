export interface Venda {
  id: number;
  nomeCliente: string;
  empresaCliente: string;
  nomeRepresentante: string;
  status: 'AGUARDANDO_PAGAMENTO' | 'EM_ROTA_DE_ENTREGA' | 'FINALIZADO' | 'CANCELADO';
  valorTotal: number;
  dataCriacao: string;
}

interface VendaItemRequest {
  produtoId: number;
  quantidade: number;
}

//Interface de requisição atualizada
export interface CriarVendaRequest {
  clienteId: number;
  representanteId: number;
  itens: VendaItemRequest[]; 
}

const API_URL = "http://localhost:8080/vendas";

// Helper que lida apenas com a autenticação.
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Buscar vendas
export async function fetchVendas(): Promise<Venda[]> {
  const res = await fetch(`${API_URL}/list`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar vendas");
  return res.json();
}

// Função createVenda atualizada
export async function createVenda(venda: CriarVendaRequest): Promise<Venda> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(venda),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao criar a venda.");
  }
  return res.json();
}

// Atualizar status da venda
export async function updateVendaStatus(id: number, status: Venda['status']): Promise<Venda> {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar status da venda");
  return res.json();
}


export async function deleteVenda(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir a venda.");
  }
}