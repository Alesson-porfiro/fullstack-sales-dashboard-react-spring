import {
  LayoutDashboard,
  BarChart3,
  Users,
  Briefcase,
  ShoppingCart,
  FileText,
  Settings,
  type LucideIcon
} from 'lucide-react';
import { Button } from '../ui/button'; 
import { Link, useLocation } from 'react-router-dom'; 
import { useAuth } from "../../hooks/AuthContext";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  group?: string;
};


const navItems: NavItem[] = [
  { label: 'Visão Geral', icon: LayoutDashboard, href: '/dashboard', group: 'Principal' },
  { label: 'Equipe', icon: Briefcase, href: '/dashboard/representantes', group: 'Gestão' },
  { label: 'Clientes', icon: Users, href: '/dashboard/clientes', group: 'Gestão' },
  { label: 'Produtos', icon: ShoppingCart, href: '/dashboard/produtos', group: 'Gestão' },
  { label: 'Vendas', icon: ShoppingCart, href: '/dashboard/vendas', group: 'Gestão' },
  { label: 'Nova venda', icon: Settings, href: '/dashboard/vendas/nova', group: 'Gestão' },
  { label: 'Análises', icon: BarChart3, href: '/dashboard/analise', group: 'Relatórios' },
  { label: 'Relatórios', icon: FileText, href: '/dashboard/relatorios', group: 'Relatórios' },
  { label: 'Configurações', icon: Settings, href: '/dashboard/configuracoes', group: 'Configuração' },

];

export function Sidebar({ isSidebarOpen }: { isSidebarOpen?: boolean }) {
  
  const location = useLocation();
  const auth = useAuth();
  

  const groupedItems = navItems.reduce((acc: Record<string, NavItem[]>, item) => {
    if (!acc[item.group!]) acc[item.group!] = [];
    acc[item.group!].push(item);
    return acc;
  }, {});

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 flex-col p-4 text-white
        bg-white/10 backdrop-blur-md border-r border-white/20 shadow-lg
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="mb-8 flex items-center">
        <h1 className="text-xl font-bold tracking-tight">
          Seja Bem vindo,
          <br />
          {auth.user?.name || 'Usuário'} 
        </h1>
      </div>
      <nav className="flex flex-col gap-y-4">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group}>
            <p className="px-2 text-xs uppercase tracking-wider opacity-70 mb-1">{group}</p>
            <div className="flex flex-col gap-y-1">
              {items.map((item) => (
                
                <Button
                  key={item.label}
                  asChild
                  
                  variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-x-3 px-2"
                >
                  
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto px-2">
        <p className="text-xs opacity-70">© 2025 Meu Dashboard</p>
      </div>
    </aside>
  );
}