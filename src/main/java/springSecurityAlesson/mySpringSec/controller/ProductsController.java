package springSecurityAlesson.mySpringSec.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springSecurityAlesson.mySpringSec.entities.Products;
import springSecurityAlesson.mySpringSec.repository.ProductsRepository;
import springSecurityAlesson.mySpringSec.services.ProductsService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductsController {

    private final ProductsService service;


    @GetMapping("/list")
    public ResponseEntity<List<Products>> getAll() {
        List<Products> products = service.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Products> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Products> createProduto(
            @RequestPart("produto") String productJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) throws IOException {

        // Converte o JSON para o objeto
        ObjectMapper objectMapper = new ObjectMapper();
        Products product = objectMapper.readValue(productJson, Products.class);


        Products salvo = service.saveWithImage(product, imagem);
        return ResponseEntity.ok(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProduto(
            @PathVariable Long id,
            @RequestPart("produto") String productJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Products productDetails = objectMapper.readValue(productJson, Products.class);

        try {

            Products atualizado = service.updateWithImage(id, productDetails, imagem);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}