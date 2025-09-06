'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, Mail, Phone, Briefcase, Lock, UploadCloud, X } from 'lucide-react';


import type { TeamRow } from '../../container/representantes/representanteService'; 
import { updateMember, createMember } from '../../container/representantes/representanteService'; 
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface TeamFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: TeamRow) => void;
  member: Partial<TeamRow> | null;
}

const initialFormData: Partial<TeamRow & { password?: string }> = { 
  nome: '', email: '', telefone: '', cargo: '', password: '' 
};

const availableRoles = [
  "ADMIN", "DIRETORIA", "JURIDICO", "RH", "TI", 
  "FATURAMENTO", "QUALIDADE", "IMPORTACAO", "LOGISTICA", "USER", "VENDA"
];

export default function TeamFormModal({ open, onClose, onSave, member }: TeamFormModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = !!member?.id;

  useEffect(() => {
    if (open) {
      if (member) {
        setFormData(member);
        setImagePreview(member.imagemUser ?? null);
      } else {
        setFormData(initialFormData);
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [member, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(member?.imagemUser ?? null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const imageInputElement = document.getElementById('imagem') as HTMLInputElement;
    if (imageInputElement) {
        imageInputElement.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result: TeamRow;
      if (isEdit && member?.id) {
        result = await updateMember(member.id, formData, imageFile ?? undefined);
        toast.success("Membro atualizado com sucesso!");
      } else {
        if (!formData.password || formData.password.length < 6) {
            toast.error("A senha é obrigatória e deve ter no mínimo 6 caracteres.");
            setLoading(false);
            return;
        }
        result = await createMember(formData, imageFile ?? undefined);
        toast.success("Membro adicionado com sucesso!");
      }
      onSave(result);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      
      <DialogContent className="bg-white/10 backdrop-blur-md border-none text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Membro da Equipe' : 'Adicionar Novo Membro'}</DialogTitle>
          <DialogDescription>
            {isEdit ? `Alterando dados de ${member?.nome}` : 'Preencha os dados do novo membro.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <InputWithIcon icon={User} id="nome" name="nome" value={formData.nome || ''} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <InputWithIcon icon={Mail} id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
              </div>
              {!isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <InputWithIcon icon={Lock} id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" onChange={handleChange} required={!isEdit} />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imagem">Foto de Perfil (Opcional)</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="imagem" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                       <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={(e) => { e.preventDefault(); handleRemoveImage(); }}>
                           <X className="h-4 w-4" />
                       </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                      <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">Clique para enviar</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou GIF</p>
                    </div>
                  )}
                  <Input id="imagem" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <InputWithIcon icon={Phone} id="telefone" name="telefone" value={formData.telefone || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Select value={formData.cargo?.replace('ROLE_', '') || ''} onValueChange={(value) => setFormData({ ...formData, cargo: value })} required>
                <SelectTrigger><SelectValue placeholder="Selecione um cargo" /></SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const InputWithIcon = ({ icon: Icon, ...props }: { icon: React.ElementType, [key: string]: any }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input {...props} className="pl-9" />
    </div>
);