package springSecurityAlesson.mySpringSec.controller.dto;

import springSecurityAlesson.mySpringSec.entities.Products;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

// DTO que agrupa todas as métricas para a página de Análises
public record DashboardAnalyticsDTO(
        List<MetricWithNameAndValue> vendasPorRepresentante,
        BigDecimal ticketMedio,
        Map<String, Long> contagemStatusPedidos,
        Long novosClientesMes,
        List<TopClientDTO> topClientes,
        List<MetricWithNameAndValue> produtosMaisVendidos,
        List<Products> produtosComEstoqueBaixo
) {
    // DTO genérico
    public record MetricWithNameAndValue(String nome, BigDecimal valor) {}


    public record TopClientDTO(String nome, BigDecimal valor, String imagemUrl) {}
}