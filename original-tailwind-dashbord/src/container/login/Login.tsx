'use client';
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../hooks/AuthContext";
import { login as loginService } from "./LoginScript";


import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";


import "./Login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginService(username, password);
      auth.login(data.token);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Usuário ou senha inválidos!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="flex justify-center items-center min-h-screen w-full overflow-hidden bg-[linear-gradient(90deg,rgba(80,145,230,1)_8%,rgba(99,99,247,1)_45%,rgba(0,212,255,1)_100%)] font-['Quicksand',_sans-serif]">

      <div className="ring">
        <i style={{ "--clr": "#fff" } as React.CSSProperties}></i>
        <i style={{ "--clr": "#fff" } as React.CSSProperties}></i>
        <i style={{ "--clr": "#fff" } as React.CSSProperties}></i>

        {/* Formulário de Login */}
        <div className="w-[300px] flex flex-col justify-center items-center gap-5 z-10">
          <h2 className="text-3xl font-semibold text-white">Login</h2>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
            <Input
  type="text"
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  required
  className="
    h-12 p-3 bg-transparent border-2 border-white rounded-full text-lg text-white placeholder:text-white/75
    focus:outline-none focus:scale-105 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0
    focus:shadow-lg focus:shadow-cyan-400/50
    transition-all duration-300 ease-in-out
"
/>

<Input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  className="
    h-12 p-3 bg-transparent border-2 border-white rounded-full text-lg text-white placeholder:text-white/75
    focus:scale-105 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0
    focus:shadow-lg focus:shadow-cyan-400/50
    transition-all duration-300 ease-in-out
"
/>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-auto p-3 border-none rounded-full text-lg cursor-pointer text-white
                         bg-[linear-gradient(90deg,rgba(2,0,36,1)_0%,rgba(9,9,121,1)_35%,rgba(0,212,255,1)_100%)]
                         hover:scale-105 focus:scale-105 transition-transform duration-300"
            >
              {isLoading ? "Entrando..." : "Sign in"}
            </Button>
          </form>

          <div className="w-full flex justify-between items-center px-5">
            <Link to="#" className="text-white no-underline hover:underline">Forget Password</Link>
            <Link to="#" className="text-white no-underline hover:underline">Signup</Link>
          </div>
        </div>
      </div>
    </div>
  );
}