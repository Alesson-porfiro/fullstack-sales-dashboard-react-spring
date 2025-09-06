import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { Client } from "../../container/clientes/clientesService";

interface ClientSelectorProps {
  representativeName: string;
  clients: Client[];
  onClientSelect: (client: Client | null) => void;
}

export function ClientSelector({ representativeName, clients, onClientSelect }: ClientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-none shadow-lg text-white">
      <CardHeader>
        <CardTitle>Dados do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/80">Representante</label>
          <p className="font-semibold">{representativeName}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-white/80">Selecionar Cliente</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-transparent hover:bg-white/10 border-white/30"
              >
                
                {selectedClient ? selectedClient.nome : "Selecione um cliente..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        // O valor do item continua sendo o nome para a busca funcionar
                        value={client.nome}
                        onSelect={() => {
                          if (selectedClient?.id === client.id) {
                            // Se clicar no mesmo cliente, desmarca
                            setSelectedClient(null);
                            onClientSelect(null);
                          } else {
                            // Se clicar em um novo, marca
                            setSelectedClient(client);
                            onClientSelect(client);
                          }
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {client.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}