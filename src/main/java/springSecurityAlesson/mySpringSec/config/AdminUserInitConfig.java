package springSecurityAlesson.mySpringSec.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import springSecurityAlesson.mySpringSec.entities.Role;
import springSecurityAlesson.mySpringSec.entities.User;
import springSecurityAlesson.mySpringSec.repository.RoleRepository;
import springSecurityAlesson.mySpringSec.repository.UserRepository;

import java.util.List;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class AdminUserInitConfig {

    private final PasswordEncoder encoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository; // A injeção de RoleRepository é essencial

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // 👇 Lógica para criar todos os cargos necessários
            List<String> roleNames = List.of("ROLE_ADMIN", "ROLE_USER", "ROLE_DIRETORIA", "ROLE_JURIDICO",
                    "ROLE_RH", "ROLE_TI", "ROLE_FATURAMENTO", "ROLE_QUALIDADE", "ROLE_IMPORTACAO", "ROLE_LOGISTICA", "ROLE_VENDA");

            for (String roleName : roleNames) {
                if (!roleRepository.findByName(roleName).isPresent()) {
                    roleRepository.save(new Role(roleName));
                }
            }

            // Busca as roles de Admin e User para o usuário inicial
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

            // Cria o usuário admin se não existir
            if (!userRepository.existsByUsername("admin")) {
                userRepository.save(User.builder()
                        .username("admin")
                        .password(encoder.encode("admin123"))
                        .email("admin@sistema.com")
                        .telefone("00000000")
                        .roles(Set.of(adminRole, userRole))
                        .build());
            }
        };
    }
}