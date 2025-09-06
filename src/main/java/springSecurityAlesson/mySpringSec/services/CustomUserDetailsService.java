package springSecurityAlesson.mySpringSec.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder; // Importe o PasswordEncoder
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; // Importe o MultipartFile
import springSecurityAlesson.mySpringSec.controller.dto.RegisterRequest;
import springSecurityAlesson.mySpringSec.entities.Role;
import springSecurityAlesson.mySpringSec.entities.User;
import springSecurityAlesson.mySpringSec.entities.enums.TipoAtividade;
import springSecurityAlesson.mySpringSec.repository.RoleRepository;
import springSecurityAlesson.mySpringSec.repository.UserRepository;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LogAtividadeService logService;
    private final PasswordEncoder passwordEncoder; // Injete o encoder para criar usuários
    private final Path rootLocation = Paths.get("uploads"); // Diretório para salvar imagens

    //Carregar usuário para autenticação
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        //Busca usuário no banco.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        //Pega as roles do usuário e transforma em SimpleGrantedAuthority (objeto que o Spring entende).
        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        //Retorna um UserDetails que o Spring Security usa no login/autenticação.
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }

    //Metodos gerenciamento arquivo
    private String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationFile = this.rootLocation.resolve(fileName).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        return "http://localhost:8080/uploads/" + fileName;
    }

    //Deletar imagem
    private void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        try {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path fileToDelete = rootLocation.resolve(filename).normalize().toAbsolutePath();
            Files.deleteIfExists(fileToDelete);
        } catch (IOException e) {
            System.err.println("Falha ao deletar imagem antiga: " + e.getMessage());
        }
    }

    //Criar Usuario
    @Transactional
    public User saveWithImage(RegisterRequest request, MultipartFile image) throws IOException {
        //Converte os nomes de roles para objetos Role.
        Set<Role> roles = request.roles().stream()
                .map(roleName -> roleRepository.findByName("ROLE_" + roleName.toUpperCase())
                        .orElseThrow(() -> new RuntimeException("Role não encontrada: " + roleName)))
                .collect(Collectors.toSet());

        //Cria o usuário com senha criptografada.
        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .telefone(request.telefone())
                .roles(roles)
                .build();

        // Salva a imagem, se existir
        String imageUrl = storeFile(image);
        if (imageUrl != null) {
            user.setImagemUser(imageUrl);
        }

        User savedUser = userRepository.save(user);
        return savedUser;
    }

    //Atualizar usuario
    @Transactional
    public User updateWithImage(Long id, User userDetails, MultipartFile image) throws IOException {
        return userRepository.findById(id).map(existingUser -> {
            String oldImageUrl = existingUser.getImagemUser();

            // Atualiza os campos
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setTelefone(userDetails.getTelefone());
            // (Não atualizamos a senha aqui, isso geralmente é um processo separado)

            if (image != null && !image.isEmpty()) {
                try {
                    String newImageUrl = storeFile(image);
                    existingUser.setImagemUser(newImageUrl);
                    if (oldImageUrl != null) {
                        deleteFile(oldImageUrl);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Falha ao salvar a nova imagem.", e);
                }
            }

            User updatedUser = userRepository.save(existingUser);

            // Log
            String descricao = String.format("Dados do membro '%s' (ID: %d) foram atualizados.", updatedUser.getUsername(), updatedUser.getId());
            logService.registrarAtividade(TipoAtividade.USUARIO_ATUALIZADO, descricao);

            return updatedUser;
        }).orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id: " + id));
    }

    //Deletar usuario
    @Transactional
    public void deleteById(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            deleteFile(user.getImagemUser()); // Deleta a imagem associada
            String descricao = String.format("O usuário '%s' (ID: %d) foi excluído.", user.getUsername(), id);
            logService.registrarAtividade(TipoAtividade.USUARIO_EXCLUIDO, descricao);
            userRepository.deleteById(id);
        });
    }

    //Atualizar role do usuário
    @Transactional
    public User updateRole(Long id, String roleStr) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));


        String roleName = "ROLE_" + roleStr.toUpperCase();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role '" + roleStr + "' inválida"));

        user.setRoles(Set.of(role));
        User updatedUser = userRepository.save(user);


        return updatedUser;
    }

    //updateUser MOVIDO PARA O SERVICE
    @Transactional
    public User updateUser(Long id, String newName, String newEmail, String newTelefone) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (newName != null && !newName.isBlank()) {
            user.setUsername(newName);
        }
        if (newEmail != null && !newEmail.isBlank()) {
            user.setEmail(newEmail);
        }
        if (newTelefone != null) {
            user.setTelefone(newTelefone);
        }

        return userRepository.save(user);
    }

    public List<User> listarTodos() {
        return userRepository.findAll();
    }
}