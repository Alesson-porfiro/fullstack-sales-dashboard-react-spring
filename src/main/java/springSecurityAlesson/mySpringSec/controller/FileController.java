package springSecurityAlesson.mySpringSec.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    private final Path rootLocation = Paths.get("uploads");

    // Este endpoint irá capturar requisições como /uploads/nome-do-arquivo.jpg
    @GetMapping("/file/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Tenta determinar o Content-Type do arquivo
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    // Fallback para um tipo genérico se não conseguir determinar
                    contentType = "application/octet-stream";
                }

                // Retorna o arquivo com o Content-Type correto
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                // Se o arquivo não for encontrado, retorna 404
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            // Se o nome do arquivo for inválido, retorna 400
            return ResponseEntity.badRequest().build();
        }
    }
}