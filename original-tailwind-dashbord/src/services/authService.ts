// src/services/authService.ts

// Adicionamos tipos para os parâmetros para maior segurança
export async function login(username: string, password: string) {
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // Lança um erro se a resposta não for bem-sucedida (ex: 401 Unauthorized)
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha no login");
    }

    const data = await response.json();

    // Salva o token no localStorage após o sucesso
    if (data.token) {
      localStorage.setItem("authToken", data.token); // Usar um nome consistente como 'authToken'
    }

    return data;
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error; // Re-lança o erro para ser pego no componente
  }
}