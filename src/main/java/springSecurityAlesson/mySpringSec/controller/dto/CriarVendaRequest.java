package springSecurityAlesson.mySpringSec.controller.dto;

import java.math.BigDecimal;
import java.util.List;

public record CriarVendaRequest(
        Long clienteId,
        Long representanteId,
        List<VendaItemRequest> itens,
        BigDecimal valorTotal
) {}
