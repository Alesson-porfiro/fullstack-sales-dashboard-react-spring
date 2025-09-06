import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Product } from "../../container/products/productsService"; 
import { createProduct, updateProduct } from "../../container/products/productsService"; 


import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label"; 
import { Textarea } from "../../components/ui/textarea"; 

type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (product: Product) => void;
  onUpdated?: (product: Product) => void;
  product?: Product | null;
};

const initialFormData: Partial<Product> = {
  nome: '',
  descricao: '',
  marca: '',
  preco: 0,
  quantidade: 0,
};

export default function ProductFormModal({ open, onClose, onCreated, onUpdated, product }: ProductFormModalProps) {
  const isEdit = !!product;

  // 1. Estado unificado para os dados do formulário
  const [formData, setFormData] = useState<Partial<Product>>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Preenche/limpa o formulário quando o modal abre
  useEffect(() => {
    if (open) {
      if (product) {
        setFormData(product);
        setImagePreview(product.imagemUrl ?? null);
      } else {
        setFormData(initialFormData);
        setImagePreview(null);
      }
      setImageFile(null); // Sempre reseta o arquivo ao abrir
    }
  }, [product, open]);

  // 2. Handler genérico para atualizar o estado do formulário
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  }

  // Handler específico para o arquivo de imagem
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      // Se o usuário cancelar, volta para a imagem original (se houver)
      setImagePreview(product?.imagemUrl ?? null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const serviceCall = isEdit && product
        ? updateProduct(product.codigo, formData, imageFile ?? undefined)
        : createProduct(formData, imageFile ?? undefined);
        
      const resultProduct = await serviceCall;

      toast.success(`Produto ${isEdit ? 'atualizado' : 'criado'} com sucesso!`);
      
      if (isEdit) {
        onUpdated?.(resultProduct);
      } else {
        onCreated?.(resultProduct);
      }
      
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-none text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Produto" : "Criar Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" value={formData.marca} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              <Input id="preco" name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input id="quantidade" name="quantidade" type="number" value={formData.quantidade} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem (opcional)</Label>
            <Input id="imagem" type="file" accept="image/*" onChange={handleFileChange} className="file:text-white" />
            {/* 3. Preview da imagem */}
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-md" />
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/10 hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-gray-200">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}