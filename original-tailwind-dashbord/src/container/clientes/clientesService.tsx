export interface Client {
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  imagem?: string;
  // Adicione outros campos que seu backend espera
}

const API_URL = "http://localhost:8080/clientes";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Buscar todos os clientes
export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${API_URL}/list`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar clientes");
  return res.json();
}

// Criar novo cliente
export async function createClientWithImage(
  client: Omit<Client, 'id' | 'imagem'>, 
  file?: File
): Promise<Client> {
  
  // Usamos FormData para enviar dados e arquivos juntos
  const formData = new FormData();
  
  // Adicionamos os dados do cliente como um 'Blob' JSON
  formData.append("client", new Blob([JSON.stringify(client)], { type: "application/json" }));
  
  // Adicionamos o arquivo de imagem, se existir
  if (file) {
    formData.append("imagem", file);
  }

  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao criar cliente");
  }
  
  return res.json();
}

// Atualizar cliente (você precisará criar este endpoint no seu backend)
export async function updateClientWithImage(
  id: number,
  client: Partial<Client>,
  file?: File
): Promise<Client> {
  const formData = new FormData();
  formData.append("client", new Blob([JSON.stringify(client)], { type: "application/json" }));
  
  if (file) {
    formData.append("imagem", file);
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(), 
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao atualizar cliente");
  }
  return res.json();
}


// Excluir cliente
export async function deleteClient(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao excluir cliente");
}