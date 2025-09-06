package springSecurityAlesson.mySpringSec.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springSecurityAlesson.mySpringSec.controller.dto.RegisterRequest;
import springSecurityAlesson.mySpringSec.entities.User;
import springSecurityAlesson.mySpringSec.services.CustomUserDetailsService;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/user") // Rota base para todas as operações de usuário/equipe
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final CustomUserDetailsService userService;
    private final ObjectMapper objectMapper = new ObjectMapper(); // Instância reutilizável

    //Lista todos usuarios
    @GetMapping("/list")
    public ResponseEntity<List<User>> listarTodos() {
        return ResponseEntity.ok(userService.listarTodos());
    }

   //Criar usuario
    @PostMapping("/create")
    public ResponseEntity<User> createMember(
            @RequestPart("member") String userJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        // Mapeia para o DTO de registro, que tem o campo 'password'
        RegisterRequest request = objectMapper.readValue(userJson, RegisterRequest.class);

        User savedUser = userService.saveWithImage(request, imagem);
        return ResponseEntity.ok(savedUser);
    }

    //Atualizar dados
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestPart("user") String userJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ) throws IOException {

        User userDetails = objectMapper.readValue(userJson, User.class);

        try {
            User updatedUser = userService.updateWithImage(id, userDetails, imagem);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Deletar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    //Atualiza role de usario
    @PatchMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        if (roleStr == null || roleStr.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            User updatedUser = userService.updateRole(id, roleStr);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            // Pode ser 404 (usuário não encontrado) ou 400 (cargo inválido)
            return ResponseEntity.badRequest().body(null);
        }
    }
}