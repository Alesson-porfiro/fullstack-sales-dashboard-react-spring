package springSecurityAlesson.mySpringSec.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import springSecurityAlesson.mySpringSec.entities.Client;
import springSecurityAlesson.mySpringSec.entities.enums.TipoAtividade;
import springSecurityAlesson.mySpringSec.repository.ClientsRepository;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {

    private final ClientsRepository clientsRepository;  //repositório Spring Data JPA para operar a tabela de clientes.
    private final Path rootLocation;    //caminho físico no servidor para salvar imagens.
    private final LogAtividadeService logService;   //serviço para registrar logs de ações (como criação, atualização, exclusão).

    //Inicializa o diretório uploads no projeto (para armazenar imagens).
    public ClientService(ClientsRepository clientsRepository, LogAtividadeService logService) {
        this.clientsRepository = clientsRepository;
        this.logService = logService;
        //Se não existir, cria o diretório.
        this.rootLocation = Paths.get("uploads");
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            //Se houver erro, lança RuntimeException.
            throw new RuntimeException("Não foi possível inicializar o local de armazenamento", e);
        }
    }

    //Retorna todos os clientes do banco de dados.
    public List<Client> findAll() {
        return clientsRepository.findAll();
    }


    //Recebe uma imagem (MultipartFile do Spring).
    private String storeFile(MultipartFile file) throws IOException {
        //Verifica se enviaram arquivo
        if (file == null || file.isEmpty()) return null;
        //Gera um nome único com UUID
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        //Salva a imagem em uploads
        Path destinationFile = this.rootLocation.resolve(Paths.get(fileName)).normalize().toAbsolutePath();
        //se já existir um arquivo com o mesmo nome, ele substitui.
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        //Retorna URL de acesso local da imagem.
        return "http://localhost:8080/uploads/" + fileName;
    }

    //Remove a imagem antiga do disco quando o cliente atualiza a foto ou é excluído.
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

    //Adiciona o cliente no banco.
    public Client saveWithImage(Client client, MultipartFile imagem) throws IOException {
        String imageUrl = storeFile(imagem);
        if (imageUrl != null) {
            client.setImagem(imageUrl);
        }
        Client savedClient = clientsRepository.save(client);

        // Registra a atividade no log
        String descricao = "Cliente '" + savedClient.getNome() + "' foi adicionado.";
        logService.registrarAtividade(TipoAtividade.CLIENTE_CRIADO, descricao);

        return savedClient;
    }

    //Atualizar cliente
    public Client updateWithImage(Long id, Client clientDetails, MultipartFile imagem) throws IOException {
        return clientsRepository.findById(id).map(existingClient -> {
            String oldImageUrl = existingClient.getImagem();

            existingClient.setNome(clientDetails.getNome());
            existingClient.setEmail(clientDetails.getEmail());
            existingClient.setEmpresa(clientDetails.getEmpresa());
            existingClient.setTelefone(clientDetails.getTelefone());

            if (imagem != null && !imagem.isEmpty()) {
                try {
                    String newImageUrl = storeFile(imagem);
                    existingClient.setImagem(newImageUrl);
                    if (oldImageUrl != null) {
                        deleteFile(oldImageUrl);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Falha ao salvar a nova imagem.", e);
                }
            }
            Client updatedClient = clientsRepository.save(existingClient);
            // Registra no log
            String descricao = "Cliente '" + updatedClient.getNome() + "' (ID: " + updatedClient.getId() + ") foi atualizado.";
            return updatedClient;
        }).orElseThrow(() -> new RuntimeException("Cliente não encontrado com o id: " + id));
    }

    //Deletar cliente
    public void delete(Long id) {
        clientsRepository.findById(id).ifPresent(client -> {
            deleteFile(client.getImagem());
            clientsRepository.deleteById(id);

            //Registra log
            String descricao = "Cliente '" + client.getNome() + "' (ID: " + client.getId() + ") foi excluído.";
        });
    }
}