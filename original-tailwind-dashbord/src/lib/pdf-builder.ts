// src/lib/pdf-builder.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { Client } from '../container/clientes/clientesService';
import type { CartItem } from '../container/novaVenda/novaVenda'; // Use o caminho correto

// Converte qualquer imagem de URL para PNG base64
async function convertImageToPNG(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // evita problemas de CORS
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Erro ao criar contexto do canvas'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png')); // força PNG
    };

    img.onerror = reject;
  });
}

export class PDFBuilder {
  private doc: jsPDF;
  private yPosition: number;
  private pageMargin = 40;
  private pageWidth: number;
  private pageHeight: number;

  constructor() {
    this.doc = new jsPDF();
    this.yPosition = this.pageMargin;
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private addHeader() {
    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Recibo de Venda', this.pageMargin, this.yPosition);
    this.yPosition += 20;

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(
      `Data: ${new Date().toLocaleDateString('pt-BR')}`,
      this.pageWidth - this.pageMargin,
      this.yPosition - 15,
      { align: 'right' }
    );

    this.doc.setDrawColor(200);
    this.doc.line(this.pageMargin, this.yPosition, this.pageWidth - this.pageMargin, this.yPosition);
    this.yPosition += 20;
  }

  private addClientInfo(client: Client, representativeName: string) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CLIENTE:', this.pageMargin, this.yPosition);
    this.doc.text('VENDIDO POR:', this.pageWidth / 2, this.yPosition);

    this.doc.setFont('helvetica', 'normal');
    this.doc.text(client.nome, this.pageMargin, this.yPosition + 12);
    this.doc.text(client.empresa, this.pageMargin, this.yPosition + 22);
    this.doc.text(client.email, this.pageMargin, this.yPosition + 32);
    this.doc.text(representativeName, this.pageWidth / 2, this.yPosition + 12);
    this.yPosition += 50;
  }

  private async addProductsTable(items: CartItem[]) {
    const tableHeaders = [['', 'Produto', 'Qntd.', 'Preço Unit.', 'Subtotal']];

    const tableBody = await Promise.all(
      items.map(async (item) => {
        const imageB64 = item.imagemUrl ? await convertImageToPNG(item.imagemUrl) : '';
        return [
          { image: imageB64, width: 25, height: 25 },
          item.nome,
          item.quantity,
          `R$ ${item.preco.toFixed(2)}`,
          `R$ ${(item.preco * item.quantity).toFixed(2)}`,
        ];
      })
    );

    autoTable(this.doc, {
      startY: this.yPosition,
      head: tableHeaders,
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          const cellData = data.cell.raw as { image: string; width: number; height: number };
          if (cellData.image) {
            this.doc.addImage(
              cellData.image,
              'PNG',
              data.cell.x + 2,
              data.cell.y + 2,
              cellData.width,
              cellData.height
            );
          }
        }
      },
      rowPageBreak: 'avoid',
      bodyStyles: { valign: 'middle', minCellHeight: 30 },
    });

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 20;
  }

  private addTotals(total: number) {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    const totalText = `Valor Total: ${total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}`;
    this.doc.text(totalText, this.pageWidth - this.pageMargin, this.yPosition, { align: 'right' });
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(10);
      this.doc.text(
        `Página ${i} de ${pageCount}`,
        this.pageWidth - this.pageMargin,
        this.pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  public async generate(client: Client, repName: string, items: CartItem[], total: number) {
    this.addHeader();
    this.addClientInfo(client, repName);
    await this.addProductsTable(items);
    this.addTotals(total);
    this.addFooter();
    this.doc.save(`venda-${client.nome.replace(/\s/g, '_')}-${Date.now()}.pdf`);
  }
}
