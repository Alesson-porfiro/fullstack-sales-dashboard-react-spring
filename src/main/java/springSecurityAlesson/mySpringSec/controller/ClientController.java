package springSecurityAlesson.mySpringSec.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springSecurityAlesson.mySpringSec.entities.Client;
import springSecurityAlesson.mySpringSec.services.ClientService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/list")
    public ResponseEntity<List<Client>> listarTodos() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<Client> createClient(
            @RequestPart("client") String clientJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Client client = objectMapper.readValue(clientJson, Client.class);

        Client salvo = clientService.saveWithImage(client, imagem);
        return ResponseEntity.ok(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable Long id,
            @RequestPart("client") String clientJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Client clientDetails = objectMapper.readValue(clientJson, Client.class);

        try {
            Client atualizado = clientService.updateWithImage(id, clientDetails, imagem);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}