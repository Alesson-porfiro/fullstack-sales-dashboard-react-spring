package springSecurityAlesson.mySpringSec.entities;

import jakarta.persistence.*;
import lombok.Data;
import springSecurityAlesson.mySpringSec.entities.enums.TipoAtividade;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_atividades")
@Data
public class LogAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoAtividade tipoAtividade;

    private String descricao;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario; // O usuário que realizou a ação

    @Column(updatable = false)
    private LocalDateTime dataHora;

    @PrePersist
    protected void onCreate() {
        dataHora = LocalDateTime.now();
    }
}