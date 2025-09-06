import React, { useState, useMemo } from "react";
import { MoreHorizontal, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

export type TeamRow = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  imagemUser?: string;
};

type SortConfig = { key: keyof TeamRow; direction: "asc" | "desc" } | null;

type TeamTableProps = {
  data: TeamRow[];
  loading?: boolean;
  onEdit: (row: TeamRow) => void;
  onDelete: (row: TeamRow) => void;
  title?: string;
  className?: string;
  onSort: (key: keyof TeamRow) => void;
  sortConfig: SortConfig;
  pageSize?: number; 
};


const badgeBaseClasses = "font-medium px-2.5 py-0.5 rounded-full text-xs border";

const roleColorMap: Record<string, string> = {
  ADMIN: "red",
  DIRETORIA: "purple",
  JURIDICO: "indigo",
  RH: "pink",
  TI: "blue",
  FATURAMENTO: "green",
  QUALIDADE: "yellow",
  IMPORTACAO: "teal",
  LOGISTICA: "orange",
  VENDA: "black",
  USER: "gray",
};

export const getRoleBadgeClasses = (role: string): string => {
  const cleanRole = role.replace("ROLE_", "").toUpperCase();
  const color = roleColorMap[cleanRole] || "slate";
  const colorClasses = `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`;
  return `${badgeBaseClasses} ${colorClasses}`;
};

const getSortIcon = (key: keyof TeamRow, sortConfig: SortConfig) => {
  if (!sortConfig || sortConfig.key !== key) return null;
  return sortConfig.direction === "asc" ? (
    <ArrowUp className="h-4 w-4 text-white" />
  ) : (
    <ArrowDown className="h-4 w-4 text-white" />
  );
};

export function TeamTable({
  data,
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  title = "Equipe",
  className,
  onSort,
  sortConfig,
  pageSize = 5,
}: TeamTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  return (
    <Card className={`w-full bg-white/10 backdrop-blur-md border-none shadow-lg text-white ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 hover:bg-white/10">
              
              <TableHead className="text-white">Membro</TableHead>
              <TableHead className="text-white hidden md:table-cell">Email</TableHead>
              <TableHead className="text-white hidden lg:table-cell">Telefone</TableHead>
              <TableHead
                className="text-white hidden sm:table-cell cursor-pointer hover:bg-white/20"
                onClick={() => onSort("cargo")}
              >
                <div className="flex items-center gap-2">
                  Cargo
                  {getSortIcon("cargo", sortConfig)}
                </div>
              </TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">Carregando...</TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">Nenhum registro encontrado.</TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id} className="border-white/10">
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={row.imagemUser} alt={row.nome} />
                        <AvatarFallback>{row.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{row.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-white/80">{row.email}</TableCell>
                  <TableCell className="hidden lg:table-cell text-white/80">{row.telefone ?? "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className={getRoleBadgeClasses(row.cargo)}>
                      {row.cargo.replace("ROLE_", "")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-white/90 hover:text-white hover:bg-white/20">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => onEdit(row)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onDelete(row)} className="text-red-400">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* 👇 Paginação no rodapé */}
      {totalPages > 1 && (
        <CardFooter className="flex justify-end items-center space-x-2 text-white">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Próxima
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
