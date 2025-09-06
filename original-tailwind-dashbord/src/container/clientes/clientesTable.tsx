import { useState } from "react";
import type { Client } from "./clientesService";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ImagePreviewModal } from "../../components/ui/image-preview-modal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface ClientsTableProps {
  data: Client[];
  loading?: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  title?: string;
}

export function ClientsTable({
  data,
  loading = false,
  onEdit,
  onDelete,
  title = "Clientes",
}: ClientsTableProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-none shadow-lg text-white">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 hover:bg-white/10">
              <TableHead className="text-white w-[10px]">ID</TableHead>
              <TableHead className="text-white">Foto</TableHead>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white hidden md:table-cell">Empresa</TableHead>
              <TableHead className="text-white hidden sm:table-cell">Email</TableHead>
              <TableHead className="text-white hidden lg:table-cell">Telefone</TableHead>
              <TableHead className="text-right text-white w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-white/80">
                  Carregando…
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-white/70">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((client, index) => (
                <TableRow key={client.id} className="border-white/10">
                  <TableCell>{client.id}</TableCell>
                  <TableCell>
                    <Avatar
                      className="h-12 w-12 cursor-pointer"
                      onClick={() => client.imagem && setPreviewIndex(index)}
                    >
                      <AvatarImage
                        src={client.imagem}
                        alt={client.nome}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {client.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{client.nome}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.empresa}</TableCell>
                  <TableCell className="hidden sm:table-cell">{client.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{client.telefone}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-white/90 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(client)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(client)}
                          className="text-red-500 focus:text-red-500"
                        >
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

      {/* Modal de preview de imagem */}
      <ImagePreviewModal
        items={data}
        startIndex={previewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </Card>
  );
}
