package springSecurityAlesson.mySpringSec.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "itens_venda")
@Data
public class ItemVenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venda_id")
    private Vendas venda;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Products produto;

    private Integer quantidade;
    private BigDecimal precoUnitario;
}