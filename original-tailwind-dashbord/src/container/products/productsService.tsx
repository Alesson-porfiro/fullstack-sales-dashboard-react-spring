// src/services/productsService.ts

export interface Product {
  codigo: number;
  nome: string;
  descricao: string;
  marca: string;
  preco: number;
  quantidade: number;
  ativo?: string;  
  imagemUrl?: string;
}

const API_URL = "http://localhost:8080/products";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Buscar todos os produtos
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/list`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao buscar produtos");

  return res.json();
}

// Buscar produto por ID
export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Produto não encontrado");

  return res.json();
}

// Criar novo produto (com ou sem imagem)
export async function createProduct(product: Partial<Product>, file?: File): Promise<Product> {
  const formData = new FormData();
  formData.append("produto", new Blob([JSON.stringify(product)], { type: "application/json" }));
  if (file) formData.append("imagem", file);

  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error("Erro ao criar produto");

  return res.json();
}

// Atualizar produto
export async function updateProduct(
  id: number,
  product: Partial<Product>,
  file?: File 
): Promise<Product> {
  const formData = new FormData();
  formData.append("produto", new Blob([JSON.stringify(product)], { type: "application/json" }));
  
  
  if (file) {
    formData.append("imagem", file);
  }


  let res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (res.status === 403 || res.status === 405) {
    res = await fetch(`${API_URL}/update/${id}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
  }

  if (!res.ok) throw new Error("Erro ao atualizar produto");

  return res.json();
}


// Excluir produto
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao excluir produto");
}
