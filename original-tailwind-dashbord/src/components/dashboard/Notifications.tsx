import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle2, Popcorn } from "lucide-react";

export function Notifications() {
  return (
    <div className="space-y-4">
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Notificações
        </h3>
      </div>

      
      <Alert className="border border-green-500 bg-green-50 text-green-700">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <div>
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>
            Suas alterações foram salvas com sucesso.
          </AlertDescription>
        </div>
      </Alert>

      
      <Alert className="border border-yellow-500 bg-yellow-50 text-yellow-700">
        <Popcorn className="h-5 w-5 text-yellow-600" />
        <div>
          <AlertTitle>Evento em andamento</AlertTitle>
          <AlertDescription>
            Confira os novos lançamentos disponíveis.
          </AlertDescription>
        </div>
      </Alert>

     
      <Alert className="border border-red-500 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <div>
          <AlertTitle>Falha no pagamento</AlertTitle>
          <AlertDescription>
            Verifique suas informações de cobrança e tente novamente.
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Confirme os dados do cartão</li>
              <li>Verifique saldo disponível</li>
              <li>Confira o endereço de cobrança</li>
            </ul>
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
