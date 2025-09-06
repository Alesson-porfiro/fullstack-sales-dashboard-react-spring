package springSecurityAlesson.mySpringSec.controller.dto;

import java.util.List;

// DTO para cada item dentro do pedido de venda
public record VendaItemRequest(
        Long produtoId,
        Integer quantidade,
        List<VendaItemRequest> itens
) {}
