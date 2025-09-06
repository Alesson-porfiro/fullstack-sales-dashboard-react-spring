import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Página Não Encontrada</h1>
      <p className="mb-8">A página que você está procurando não existe.</p>
      <Link to="/dashboard" className="text-blue-500 hover:underline">
        Voltar para o Dashboard
      </Link>
    </div>
  );
}