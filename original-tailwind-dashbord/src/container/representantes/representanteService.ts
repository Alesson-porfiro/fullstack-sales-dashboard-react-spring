  export interface TeamRow {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  imagemUser?: string; 
}

export interface CreateMemberData {
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  password?: string;
}

export interface UpdateMemberData {
  nome?: string;
  email?: string;
  telefone?: string;
  cargo?: string;
}

const API_URL = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}


function mapUserToTeamRow(user: any): TeamRow {
  return {
    id: user.id,
    nome: user.username,
    email: user.email,
    telefone: user.telefone,
    imagemUser: user.imagemUser, 
    cargo: user.roles?.map((r: any) => r.name.replace("ROLE_", "")).join(", ") ?? "—",
  };
}



export async function fetchTeam(): Promise<TeamRow[]> {
  const res = await fetch(`${API_URL}/user/list`, { 
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar equipe");
  const data = await res.json();
  return data.map(mapUserToTeamRow);
}

export async function createMember(
  data: CreateMemberData,
  file?: File
): Promise<TeamRow> {
  const body = {
    username: data.nome,
    email: data.email,
    telefone: data.telefone,
    password: data.password,
    roles: [data.cargo],
  };

  const formData = new FormData();
  formData.append("member", new Blob([JSON.stringify(body)], { type: "application/json" }));
  if (file) formData.append("imagem", file);

  const res = await fetch(`${API_URL}/user/create`, { 
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error("Erro ao adicionar novo membro");
  const createdUser = await res.json();
  return mapUserToTeamRow(createdUser);
}

export async function updateMember(
  id: number,
  data: UpdateMemberData,
  file?: File
): Promise<TeamRow> {
  const body = {
    username: data.nome,
    email: data.email,
    telefone: data.telefone,
  };

  const formData = new FormData();
  formData.append("user", new Blob([JSON.stringify(body)], { type: "application/json" })); 
  if (file) formData.append("imagem", file);

  const res = await fetch(`${API_URL}/user/${id}`, { 
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error("Erro ao atualizar membro");
  const updatedUser = await res.json();
  return mapUserToTeamRow(updatedUser);
}

export async function deleteMember(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/user/${id}`, { 
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao excluir membro");
}
