interface LoginResponse {
  token: string;
  
}


export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
  
      const errorData = await response.json();
      throw new Error(errorData.message || "Usuário ou senha inválidos");
    }

    const data: LoginResponse = await response.json();
    
    
    return data;

  } catch (error) {
    console.error("Erro no serviço de login:", error);
    
    throw error;
  }
}