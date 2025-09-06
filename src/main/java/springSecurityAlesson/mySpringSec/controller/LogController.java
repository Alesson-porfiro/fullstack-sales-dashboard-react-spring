package springSecurityAlesson.mySpringSec.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springSecurityAlesson.mySpringSec.entities.LogAtividade;
import springSecurityAlesson.mySpringSec.repository.LogAtividadeRepository;
import springSecurityAlesson.mySpringSec.services.LogAtividadeService;

import java.util.List;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {

    private final LogAtividadeRepository logRepository;
    private final LogAtividadeService logService;

    @GetMapping
    public ResponseEntity<List<LogAtividade>> getLogs() {
        return ResponseEntity.ok(logRepository.findAllByOrderByDataHoraDesc());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        try {
            logService.deleteLog(id);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content (sucesso)
        } catch (RuntimeException e) { // Pode ser uma exceção mais específica
            return ResponseEntity.notFound().build(); // Retorna 404 se não encontrar
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllLogs() {
        logService.deleteAllLogs();
        return ResponseEntity.noContent().build();
    }
}