import { useState } from "react";
import type { Product } from "./productsService";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { ImagePreviewModal } from "../../components/ui/ImagePreviewModal";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

type ProductsTableProps = {
  data: Product[];
  loading?: boolean;
  onEdit?: (row: Product) => void;
  onDelete?: (row: Product) => void;
  title?: string;
  className?: string;
};

export function ProductsTable({
  data,
  loading = false,
  onEdit,
  onDelete,
  title = "Produtos",
  className,
}: ProductsTableProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <>
      <Card className={`bg-white/10 backdrop-blur-md border-none shadow-lg text-white ${className}`}>
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-white/10">
                <TableHead className="text-white">Código</TableHead>
                <TableHead className="text-white w-[100px]">Foto</TableHead>
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white hidden lg:table-cell">Descrição</TableHead>
                <TableHead className="text-white hidden md:table-cell">Marca</TableHead>
                <TableHead className="text-white">Preço</TableHead>
                <TableHead className="text-white">Estoque</TableHead>
                <TableHead className="text-white hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-white/80">
                    Carregando…
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-white/70">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((product, index) => (
                  <TableRow key={product.codigo} className="border-white/10">
                    <TableCell>{product.codigo}</TableCell>
                    <TableCell>
                      <Avatar
                        className="h-16 w-16 cursor-pointer rounded-full"
                        onClick={() => product.imagemUrl && setPreviewIndex(index)}
                      >
                        <AvatarImage
                          src={product.imagemUrl}
                          alt={product.nome}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-full bg-white/10">Sem Img</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{product.nome}</TableCell>
                    <TableCell className="truncate max-w-xs hidden lg:table-cell">{product.descricao}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.marca}</TableCell>
                    <TableCell>
                      {product.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </TableCell>
                    <TableCell>{product.quantidade}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={product.ativo ? "default" : "destructive"}
                        className={product.ativo ? "bg-green-600 border-none" : "border-none"}
                      >
                        {product.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/90 hover:text-white hover:bg-white/20"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit?.(product)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete?.(product)}
                            className="cursor-pointer text-red-500 focus:text-red-500"
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
      </Card>

      {/* Preview de imagem */}
      <ImagePreviewModal
        items={data}
        startIndex={previewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  );
}
