package springSecurityAlesson.mySpringSec.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import springSecurityAlesson.mySpringSec.controller.dto.AuthRequest;
import springSecurityAlesson.mySpringSec.controller.dto.AuthResponse;
import springSecurityAlesson.mySpringSec.controller.dto.RegisterRequest;
import springSecurityAlesson.mySpringSec.entities.Role;
import springSecurityAlesson.mySpringSec.entities.User;
import springSecurityAlesson.mySpringSec.repository.RoleRepository; // 👈 1. Importe o RoleRepository
import springSecurityAlesson.mySpringSec.repository.UserRepository;
import springSecurityAlesson.mySpringSec.services.JwtService;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.existsByUsername(req.username())) {
            return ResponseEntity.badRequest().body("{\"error\": \"Username already exists\"}");
        }

        Role userRole = roleRepo.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        User user = User.builder()
                .username(req.username())
                .password(encoder.encode(req.password()))
                .email(req.email())
                .telefone(req.telefone())
                .roles(Set.of(userRole))
                .build();

        userRepo.save(user);
        return ResponseEntity.ok("{\"message\": \"User registered successfully!\"}");
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getUsername());
        claims.put("userId", user.getId());
        claims.put("roles", user.getRoles().stream().map(Role::getName).toList());


        if (user.getImagemUser() != null) {
            claims.put("picture", user.getImagemUser());
        }

        String token = jwtService.generateToken(auth.getName(), claims);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}