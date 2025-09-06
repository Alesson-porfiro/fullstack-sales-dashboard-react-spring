package springSecurityAlesson.mySpringSec.controller.dto;

import springSecurityAlesson.mySpringSec.entities.enums.StatusVenda;

// Este record define o dado necessário para atualizar o status de uma venda
public record AtualizarStatusRequest(
        StatusVenda status
) {}