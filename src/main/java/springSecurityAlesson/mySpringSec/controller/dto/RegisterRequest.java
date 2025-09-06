package springSecurityAlesson.mySpringSec.controller.dto;

import lombok.Data;
import springSecurityAlesson.mySpringSec.entities.Role;

import java.util.Set;

// src/main/java/.../dto/RegisterRequest.java
public record RegisterRequest(
        String username,
        String password,
        String email,
        String telefone,
        Set<String> roles // Permite enviar um ou mais cargos
) {}