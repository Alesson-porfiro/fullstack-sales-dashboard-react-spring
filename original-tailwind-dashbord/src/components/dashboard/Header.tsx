import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    logout(); 
    navigate("/login"); 
  };

  return (
    <header
      className="flex justify-between items-center mb-8 p-6 rounded-xl
                 bg-[linear-gradient(90deg,rgba(80,145,230,1)_8%,rgba(99,99,247,1)_45%,rgba(0,212,255,1)_100%)]
                 shadow-lg text-white transition-transform duration-300 ease-in-out"
    >
      
      <button
        className="p-2 rounded-md hover:bg-white/20 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>

      
      <div>
        <h2 className="text-3xl font-bold tracking-tight shadow-black/50 text-shadow">Visão Geral</h2>
        <p className="text-sm opacity-80 mt-1 ">Resumo das principais métricas</p>
      </div>

      
      <div className="flex items-center space-x-4">
        
        <Button
          onClick={() => navigate("/dashboard/vendas/nova")}
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white 
             hover:scale-105 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 transition"
        >
          <Plus className="h-5 w-5" />
          Nova Venda
        </Button>

        
        <Button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-400 to-rose-500 text-white 
                     hover:scale-105 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 transition"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>

        

        
        <Avatar>
          <AvatarImage src={user?.picture} alt={user?.name} />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
