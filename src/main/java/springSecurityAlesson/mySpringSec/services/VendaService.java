package springSecurityAlesson.mySpringSec.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springSecurityAlesson.mySpringSec.controller.dto.AtualizarStatusRequest;
import springSecurityAlesson.mySpringSec.controller.dto.CriarVendaRequest;
import springSecurityAlesson.mySpringSec.controller.dto.VendaDTO;
import springSecurityAlesson.mySpringSec.controller.dto.VendaItemRequest;
import springSecurityAlesson.mySpringSec.entities.*; // 👈 1. Importa todas as entidades de uma vez, incluindo ItemVenda
import springSecurityAlesson.mySpringSec.entities.enums.StatusVenda;
import springSecurityAlesson.mySpringSec.entities.enums.TipoAtividade;
import springSecurityAlesson.mySpringSec.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ClientsRepository clientsRepository;
    private final UserRepository userRepository;
    private final ProductsRepository productsRepository;
    private final ItemVendaRepository itemVendaRepository;
    private final LogAtividadeService logService;

    @Transactional(readOnly = true)
    public List<VendaDTO> findAll() {
        return vendaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VendaDTO> findRecentSales() {
        return vendaRepository.findFirst5ByOrderByIdDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VendaDTO create(CriarVendaRequest request) {
        Client cliente = clientsRepository.findById(request.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        User representante = userRepository.findById(request.representanteId())
                .orElseThrow(() -> new RuntimeException("Representante não encontrado"));

        Vendas novaVenda = new Vendas();
        novaVenda.setCliente(cliente);
        novaVenda.setRepresentante(representante);
        novaVenda.setStatus(StatusVenda.AGUARDANDO_PAGAMENTO);
        novaVenda.setItens(new ArrayList<>());

        BigDecimal valorTotalCalculado = BigDecimal.ZERO;


        for (VendaItemRequest itemReq : request.itens()) {
            Products produto = productsRepository.findById(itemReq.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto com ID " + itemReq.produtoId() + " não encontrado."));

            if (produto.getQuantidade() < itemReq.quantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            produto.setQuantidade(produto.getQuantidade() - itemReq.quantidade());
            productsRepository.save(produto);

            ItemVenda itemVenda = new ItemVenda(); // Agora o Java conhece esta classe
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(itemReq.quantidade());
            itemVenda.setPrecoUnitario(produto.getPreco());
            itemVenda.setVenda(novaVenda);

            novaVenda.getItens().add(itemVenda);

            valorTotalCalculado = valorTotalCalculado.add(
                    produto.getPreco().multiply(new BigDecimal(itemReq.quantidade()))
            );
        }

        novaVenda.setValorTotal(valorTotalCalculado);
        Vendas savedVenda = vendaRepository.save(novaVenda);

        String descricao = String.format(
                "Nova venda (ID: %d) de R$ %.2f registrada para o cliente '%s'.",
                savedVenda.getId(), savedVenda.getValorTotal(), savedVenda.getCliente().getNome()
        );
        logService.registrarAtividade(TipoAtividade.VENDA_CRIADA, descricao);

        return toDTO(savedVenda);
    }

    @Transactional
    public VendaDTO updateStatus(Long id, AtualizarStatusRequest request) {
        Vendas venda = vendaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));

        venda.setStatus(request.status());
        Vendas updatedVenda = vendaRepository.save(venda);

        String descricao = String.format(
                "O status da venda (ID: %d) do cliente '%s' foi alterado para %s.",
                updatedVenda.getId(),
                updatedVenda.getCliente().getNome(),
                updatedVenda.getStatus().toString().replace('_', ' ')
        );
        logService.registrarAtividade(TipoAtividade.VENDA_STATUS_ATUALIZADO, descricao);

        return toDTO(updatedVenda);
    }

    @Transactional
    public void delete(Long id) {
        Vendas vendaParaExcluir = vendaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));

        String descricao = String.format(
                "A venda (ID: %d) de R$ %.2f do cliente '%s' foi excluída.",
                vendaParaExcluir.getId(),
                vendaParaExcluir.getValorTotal(),
                vendaParaExcluir.getCliente().getNome()
        );
        logService.registrarAtividade(TipoAtividade.VENDA_EXCLUIDA, descricao);

        vendaRepository.deleteById(id);
    }

    //
    private VendaDTO toDTO(Vendas venda) {
        return new VendaDTO(
                venda.getId(),
                venda.getCliente().getNome(),
                venda.getCliente().getEmpresa(),
                venda.getCliente().getEmail(),      // emailCliente
                venda.getCliente().getImagem(),     // imagemUrlCliente
                venda.getRepresentante().getUsername(),
                venda.getStatus(),
                venda.getValorTotal(),
                venda.getDataCriacao()
        );
    }
}