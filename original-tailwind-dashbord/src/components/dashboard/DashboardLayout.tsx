import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "../../components/ui/sonner";

export function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Função para fechar a sidebar, que será usada pelo overlay
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[linear-gradient(90deg,rgba(80,145,230,1)_8%,rgba(99,99,247,1)_45%,rgba(0,212,255,1)_100%)]">
      
      {/* A sidebar agora também pode receber a função de fechar (para um botão 'X' futuro) */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Passamos a função para o Header para ABRIR/FECHAR o menu */}
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}