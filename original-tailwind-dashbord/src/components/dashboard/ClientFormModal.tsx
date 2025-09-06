import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Client } from "../../container/clientes/clientesService";
import { createClientWithImage, updateClientWithImage } from "../../container/clientes/clientesService";


import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

type ClientFormModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (client: Client) => void;
  onUpdated?: (client: Client) => void;
  client?: Client | null;
};

const initialFormData: Partial<Client> = {
  nome: "",
  empresa: "",
  email: "",
  telefone: "",
};

export default function ClientFormModal({
  open,
  onClose,
  onCreated,
  onUpdated,
  client,
}: ClientFormModalProps) {
  const isEdit = !!client;

  const [formData, setFormData] = useState<Partial<Client>>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Preenche ou limpa quando abrir
  useEffect(() => {
    if (open) {
      if (client) {
        setFormData(client);
        setImagePreview(client.imagem ?? null);
      } else {
        setFormData(initialFormData);
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [client, open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(client?.imagem ?? null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && client) {
       
        const updated = await updateClientWithImage(
          client.id, 
          formData, 
          imageFile ?? undefined
        );
        
        toast.success("Cliente atualizado com sucesso!");
        onUpdated?.(updated);

      } else {
        const created = await createClientWithImage(
          formData as Omit<Client, "id" | "imagem">, 
          imageFile ?? undefined
        );

        toast.success("Cliente criado com sucesso!");
        onCreated?.(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-none text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Cliente" : "Criar Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem (opcional)</Label>
            <Input id="imagem" type="file" accept="image/*" onChange={handleFileChange} className="file:text-white" />
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
