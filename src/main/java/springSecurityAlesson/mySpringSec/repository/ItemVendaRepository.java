package springSecurityAlesson.mySpringSec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import springSecurityAlesson.mySpringSec.controller.dto.DashboardAnalyticsDTO;
import springSecurityAlesson.mySpringSec.entities.ItemVenda;

import java.util.List;

@Repository // Define esta interface como um componente de repositório do Spring
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> { // 👈 Precisa estender JpaRepository

    @Query("SELECT new springSecurityAlesson.mySpringSec.controller.dto.DashboardAnalyticsDTO$MetricWithNameAndValue(iv.produto.nome, CAST(SUM(iv.quantidade) AS java.math.BigDecimal)) " +
            "FROM ItemVenda iv " +
            "GROUP BY iv.produto.nome " +
            "ORDER BY SUM(iv.quantidade) DESC " +
            "LIMIT 5")
    List<DashboardAnalyticsDTO.MetricWithNameAndValue> findTop5ProdutosMaisVendidos();
}
