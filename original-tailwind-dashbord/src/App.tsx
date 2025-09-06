import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { ProtectedRoute } from "./components/dashboard/ProtectedRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthProvider } from "./hooks/AuthContext";

// Importe suas páginas
import LoginPage from "./container/login/Login";
import ProductsPage from "./container/products/products";
import DashboardPage from "./pages/DashboardPage"; // A página com os cards e gráficos
import Clientes from "./container/clientes/clientes";
import Representantes from "./container/representantes/represen";
import Vendas from "./container/vendas/vendas"
import NovaVendaPage from "./container/novaVenda/novaVenda";
import Relatorio from "./container/logs/RelatoriosPage";
import Analytics from "./container/analise/analisesPage";


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        

        {/* Rotas Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="representantes" element={<Representantes />} />
          <Route path="vendas" element={<Vendas />} />
          <Route path="produtos" element={<ProductsPage />} />
          <Route path="vendas/nova" element={<NovaVendaPage />} />
          <Route path="relatorios" element={<Relatorio />} />
          <Route path="analise" element={<Analytics />} />
          {/* ...outras rotas... */}
        </Route>

        {/* Redirecionamentos e 404 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;