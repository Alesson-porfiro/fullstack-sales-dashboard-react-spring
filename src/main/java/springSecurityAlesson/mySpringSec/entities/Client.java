package springSecurityAlesson.mySpringSec.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( nullable = false)
    private String nome;

    @Column(nullable = false)
    private String empresa;

    @Column( nullable = false)
    private String email;

    @Column( nullable = false)
    private String telefone;

    private String imagem;

    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    // 👇 3. ADICIONE ESTE MÉTODO
    // Este método é chamado automaticamente pelo JPA antes de um novo cliente ser salvo
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
