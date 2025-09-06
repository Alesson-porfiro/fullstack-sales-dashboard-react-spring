package springSecurityAlesson.mySpringSec.controller.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}
