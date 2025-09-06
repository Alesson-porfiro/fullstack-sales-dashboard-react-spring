import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { Product } from "../../container/products/productsService";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductCatalog({ products, onAddToCart }: ProductCatalogProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-none shadow-lg text-white h-full">
      <CardHeader>
        <CardTitle>Catálogo de Produtos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
        {products.map((product) => (
          <div key={product.codigo} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-md">
                <AvatarImage src={product.imagemUrl} />
                <AvatarFallback className="rounded-md">Sem Img</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{product.nome}</p>
                <p className="text-sm text-white/70">Estoque: {product.quantidade}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <p className="font-semibold">
                {product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <Button size="sm" onClick={() => onAddToCart(product)}>Adicionar</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}