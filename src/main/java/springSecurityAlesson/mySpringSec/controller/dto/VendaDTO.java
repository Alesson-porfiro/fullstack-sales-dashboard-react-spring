package springSecurityAlesson.mySpringSec.controller.dto;

import springSecurityAlesson.mySpringSec.entities.enums.StatusVenda;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VendaDTO(
        Long id,
        String nomeCliente,
        String empresaCliente,
        String emailCliente,
        String imagemUrlCliente,
        String nomeRepresentante,
        StatusVenda status,
        BigDecimal valorTotal,
        LocalDateTime dataCriacao
) {}