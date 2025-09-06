const API_URL = "http://localhost:8080/analytics";
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export interface MetricWithNameAndValue {
  nome: string;
  valor: number;
}

export interface TopClientMetric extends MetricWithNameAndValue {
  imagemUrl?: string; 
}

export interface DashboardAnalytics {
  vendasPorRepresentante: MetricWithNameAndValue[];
  ticketMedio: number;
  contagemStatusPedidos: Record<string, number>;
  novosClientesMes: number;
  topClientes: TopClientMetric[]; // 👈 Corrigido
  produtosMaisVendidos: MetricWithNameAndValue[];
  produtosComEstoqueBaixo: number;
}

export async function fetchDashboardAnalytics(): Promise<DashboardAnalytics> {
  const res = await fetch(`${API_URL}/dashboard`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar dados de análise");
  return res.json();
}