package springSecurityAlesson.mySpringSec.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springSecurityAlesson.mySpringSec.controller.dto.AtualizarStatusRequest;
import springSecurityAlesson.mySpringSec.controller.dto.CriarVendaRequest;
import springSecurityAlesson.mySpringSec.controller.dto.VendaDTO;
import springSecurityAlesson.mySpringSec.services.VendaService;

import java.util.List;

@RestController
@RequestMapping("/vendas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VendaController {

    private final VendaService vendaService;

    //listar produtos
    @GetMapping("/list")
    public ResponseEntity<List<VendaDTO>> listarTodos() {
        return ResponseEntity.ok(vendaService.findAll());
    }

    //Buscar vendas mais recentes
    @GetMapping("/recent")
    public ResponseEntity<List<VendaDTO>> listarRecentes() {
        return ResponseEntity.ok(vendaService.findRecentSales());
    }

    @PostMapping
    public ResponseEntity<VendaDTO> criarVenda(@RequestBody CriarVendaRequest request) {
        VendaDTO novaVenda = vendaService.create(request);
        return ResponseEntity.ok(novaVenda);
    }

    // Usamos PATCH para atualizações parciais, como mudar apenas o status. É mais semântico.
    @PatchMapping("/{id}/status")
    public ResponseEntity<VendaDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody AtualizarStatusRequest request) {
        try {
            VendaDTO vendaAtualizada = vendaService.updateStatus(id, request);
            return ResponseEntity.ok(vendaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Deletar produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVenda(@PathVariable Long id) {
        try {
            vendaService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
