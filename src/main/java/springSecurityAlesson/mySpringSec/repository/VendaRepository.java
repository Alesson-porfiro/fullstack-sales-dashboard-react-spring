package springSecurityAlesson.mySpringSec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import springSecurityAlesson.mySpringSec.controller.dto.DashboardAnalyticsDTO;
import springSecurityAlesson.mySpringSec.entities.Vendas;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VendaRepository extends JpaRepository<Vendas, Long> {
    List<Vendas> findFirst5ByOrderByIdDesc();

    @Query("SELECT new springSecurityAlesson.mySpringSec.controller.dto.DashboardAnalyticsDTO$MetricWithNameAndValue(v.representante.username, SUM(v.valorTotal)) " +
            "FROM Vendas v " +
            "GROUP BY v.representante.username " +
            "ORDER BY SUM(v.valorTotal) DESC")
    List<DashboardAnalyticsDTO.MetricWithNameAndValue> findVendasPorRepresentante();

    // Você precisará adicionar os outros métodos customizados aqui também
    // Exemplo para Ticket Médio:
    @Query("SELECT AVG(v.valorTotal) FROM Vendas v WHERE v.dataCriacao >= :startDate")
    Optional<BigDecimal> findTicketMedio(LocalDateTime startDate);

    // Exemplo para Contagem de Status:
    @Query("SELECT v.status, COUNT(v) FROM Vendas v GROUP BY v.status")
    List<Object[]> countVendasByStatusRaw();

    @Query("SELECT v.status, COUNT(v) FROM Vendas v GROUP BY v.status")
    List<Object[]> countVendasByStatus();

    @Query("SELECT new springSecurityAlesson.mySpringSec.controller.dto.DashboardAnalyticsDTO$TopClientDTO(v.cliente.nome, SUM(v.valorTotal), v.cliente.imagem) " +
            "FROM Vendas v " +
            "GROUP BY v.cliente.id, v.cliente.nome, v.cliente.imagem " + // Agrupa também pela imagem
            "ORDER BY SUM(v.valorTotal) DESC " +
            "LIMIT 5")
    List<DashboardAnalyticsDTO.TopClientDTO> findTop5ClientesPorValor();
}

