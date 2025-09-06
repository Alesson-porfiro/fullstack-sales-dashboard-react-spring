import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import type { CartItem } from "../../container/novaVenda/novaVenda"; 
import { X } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  total: number;
}

export function OrderSummary({ items, onUpdateQuantity, total }: OrderSummaryProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-none shadow-lg text-white h-full">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[55vh] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-white/70">O carrinho está vazio.</p>
        ) : (
          items.map((item) => (
            <div key={item.codigo} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.nome}</p>
                <p className="text-white/70">
                  {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.codigo, parseInt(e.target.value) || 0)}
                  className="w-16 h-8 bg-transparent border-white/30"
                />
                <button onClick={() => onUpdateQuantity(item.codigo, 0)} className="text-red-400 hover:text-red-500">
                  <X className="h-4 w-4"/>
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-4 border-t border-white/20">
        <div className="w-full flex justify-between">
          <span>Subtotal</span>
          <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="w-full flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}