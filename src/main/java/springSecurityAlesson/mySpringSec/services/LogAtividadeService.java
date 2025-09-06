package springSecurityAlesson.mySpringSec.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseStatus;
import springSecurityAlesson.mySpringSec.entities.LogAtividade;
import springSecurityAlesson.mySpringSec.entities.User;
import springSecurityAlesson.mySpringSec.entities.enums.TipoAtividade;
import springSecurityAlesson.mySpringSec.repository.LogAtividadeRepository;
import springSecurityAlesson.mySpringSec.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class LogAtividadeService {

    private final LogAtividadeRepository logRepository;
    private final UserRepository userRepository;

    // ✅ Exceção customizada corretamente fechada
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    //Metodo registrar atividade
    public void registrarAtividade(TipoAtividade tipo, String descricao) {
        // Pega o principal (usuário) do contexto de segurança
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        // Busca a entidade User no banco
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado no contexto de segurança para registrar o log"));

        // Cria o log
        LogAtividade log = new LogAtividade();
        log.setTipoAtividade(tipo);
        log.setDescricao(descricao);
        log.setUsuario(usuario);

        logRepository.save(log);
    }

    @Transactional
    public void deleteLog(Long id) {
        if (!logRepository.existsById(id)) {
            throw new ResourceNotFoundException("Log de atividade não encontrado com o ID: " + id);
        }
        logRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllLogs() {
        logRepository.deleteAll(); // deleta tudo
        // registrarAtividade aqui causaria conflito, então chame depois em outra transação
    }
}
