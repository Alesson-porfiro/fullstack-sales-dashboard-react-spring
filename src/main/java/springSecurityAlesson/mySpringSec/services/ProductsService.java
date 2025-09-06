package springSecurityAlesson.mySpringSec.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import springSecurityAlesson.mySpringSec.entities.Products;
import springSecurityAlesson.mySpringSec.entities.enums.TipoAtividade; // 👈 Importe o Enum
import springSecurityAlesson.mySpringSec.repository.ProductsRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductsService {

    private final ProductsRepository repository;
    private final LogAtividadeService logService;
    private final Path rootLocation = Paths.get("uploads");

    // Helper para salvar arquivos
    private String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationFile = this.rootLocation.resolve(fileName).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        return "http://localhost:8080/uploads/" + fileName;
    }

    // Helper para deletar arquivos
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

    public List<Products> findAll() { return repository.findAll(); }

    public Optional<Products> findById(Long id) { return repository.findById(id); }

    @Transactional
    public Products saveWithImage(Products product, MultipartFile image) throws IOException {
        String imageUrl = storeFile(image);
        if (imageUrl != null) {
            product.setImagemUrl(imageUrl);
        }
        Products savedProduct = repository.save(product);
        String descricao = String.format("Produto '%s' (ID: %d) foi criado.", savedProduct.getNome(), savedProduct.getCodigo());
        logService.registrarAtividade(TipoAtividade.PRODUTO_CRIADO, descricao);
        return savedProduct;
    }

    @Transactional
    public Products updateWithImage(Long id, Products productDetails, MultipartFile image) throws IOException {
        return repository.findById(id).map(existingProduct -> {
            String oldImageUrl = existingProduct.getImagemUrl();
            existingProduct.setNome(productDetails.getNome());
            existingProduct.setDescricao(productDetails.getDescricao());
            existingProduct.setMarca(productDetails.getMarca());
            existingProduct.setPreco(productDetails.getPreco());
            existingProduct.setQuantidade(productDetails.getQuantidade());
            existingProduct.setAtivo(productDetails.getAtivo());

            if (image != null && !image.isEmpty()) {
                try {
                    String newImageUrl = storeFile(image);
                    existingProduct.setImagemUrl(newImageUrl);
                    if (oldImageUrl != null) {
                        deleteFile(oldImageUrl);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Falha ao salvar a nova imagem.", e);
                }
            }
            Products updatedProduct = repository.save(existingProduct);
            String descricao = String.format("Produto '%s' (ID: %d) foi atualizado.", updatedProduct.getNome(), updatedProduct.getCodigo());
            logService.registrarAtividade(TipoAtividade.PRODUTO_ATUALIZADO, descricao);
            return updatedProduct;
        }).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    @Transactional
    public void delete(Long id) {
        repository.findById(id).ifPresent(product -> {
            deleteFile(product.getImagemUrl());
            String descricao = String.format("Produto '%s' (ID: %d) foi excluído.", product.getNome(), product.getCodigo());
            logService.registrarAtividade(TipoAtividade.PRODUTO_EXCLUIDO, descricao);
            repository.deleteById(id);
        });
    }
}