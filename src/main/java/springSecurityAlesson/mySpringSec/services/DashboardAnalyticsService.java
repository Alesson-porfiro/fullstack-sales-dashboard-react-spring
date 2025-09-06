package springSecurityAlesson.mySpringSec.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import springSecurityAlesson.mySpringSec.controller.dto.DashboardAnalyticsDTO;
import springSecurityAlesson.mySpringSec.entities.Products;
import springSecurityAlesson.mySpringSec.entities.enums.StatusVenda;
import springSecurityAlesson.mySpringSec.repository.*; // Importe seus repositórios

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardAnalyticsService {

    private final VendaRepository vendaRepository;
    private final ClientsRepository clientRepository;
    private final ItemVendaRepository itemVendaRepository;
    private final ProductsRepository productsRepository;

    //Cria uma data de referência (30 dias) para métricas de período
    public DashboardAnalyticsDTO getDashboardAnalytics() {
        LocalDateTime trintaDiasAtras = LocalDateTime.now().minusDays(30);

        //Contagem de vendas
        Map<String, Long> contagemStatus = vendaRepository.countVendasByStatus().stream()
                .collect(Collectors.toMap(
                        row -> ((StatusVenda) row[0]).name(),
                        row -> (Long) row[1]
                ));

        //total de vendas por representante (quem vendeu mais)
        List<DashboardAnalyticsDTO.MetricWithNameAndValue> vendasPorRep = vendaRepository.findVendasPorRepresentante();
        //valor médio das vendas nos últimos 30 dias
        BigDecimal ticketMedio = vendaRepository.findTicketMedio(trintaDiasAtras).orElse(BigDecimal.ZERO);
        //quantidade de clientes cadastrados nos últimos 30 dias
        Long novosClientes = clientRepository.countByCreatedAtAfter(trintaDiasAtras);
        //top 5 clientes que mais compraram (em valor)
        List<DashboardAnalyticsDTO.TopClientDTO> topClientes = vendaRepository.findTop5ClientesPorValor();
        //top 5 produtos mais vendidos
        List<DashboardAnalyticsDTO.MetricWithNameAndValue> produtosMaisVendidos = itemVendaRepository.findTop5ProdutosMaisVendidos();
        //lista de produtos com estoque menor que 5
        List<Products> produtosComEstoqueBaixo = productsRepository.findByQuantidadeLessThanEqual(5);

        return new DashboardAnalyticsDTO(
                vendasPorRep,
                ticketMedio,
                contagemStatus,
                novosClientes,
                topClientes,
                produtosMaisVendidos,
                produtosComEstoqueBaixo
        );
    }
}