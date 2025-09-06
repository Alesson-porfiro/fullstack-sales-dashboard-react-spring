// src/components/ui/image-preview-modal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "./dialog";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// O tipo de item que a galeria aceita. Precisa de uma URL de imagem e um título.
type GalleryItem = {
  imagemUrl?: string;
  nome: string;
};

interface ImagePreviewModalProps {
  items: GalleryItem[];
  startIndex: number | null; // O índice da imagem a ser aberta
  onClose: () => void;
}

export function ImagePreviewModal({ items, startIndex, onClose }: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(startIndex);

  // Sincroniza o índice interno com a prop que vem de fora
  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  // Adiciona navegação pelo teclado (setas esquerda/direita)
  useEffect(() => {
    if (currentIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items]); // Recria o listener quando o índice ou os itens mudam

  const handlePrev = () => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev! > 0 ? prev! - 1 : items.length - 1));
    }
  };

  const handleNext = () => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev! < items.length - 1 ? prev! + 1 : 0));
    }
  };

  const currentItem = currentIndex !== null ? items[currentIndex] : null;

  return (
    <Dialog open={currentIndex !== null} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 backdrop-blur-sm border-none shadow-none p-2 w-screen h-screen max-w-full max-h-full flex items-center justify-center">
        {currentItem && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Botão Fechar (X) */}
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>

            {/* Botão Anterior */}
            <Button variant="ghost" size="icon" className="absolute left-4 z-50 text-white hover:bg-white/20 hover:text-white" onClick={handlePrev}>
              <ChevronLeft className="h-10 w-10" />
            </Button>
            
            {/* Imagem Principal */}
            <div className="flex flex-col items-center justify-center gap-4">
              <img
                src={currentItem.imagemUrl}
                alt={currentItem.nome}
                className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
              />
              <p className="text-white text-lg font-medium">{currentItem.nome}</p>
            </div>

            {/* Botão Próximo */}
            <Button variant="ghost" size="icon" className="absolute right-4 z-50 text-white hover:bg-white/20 hover:text-white" onClick={handleNext}>
              <ChevronRight className="h-10 w-10" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}