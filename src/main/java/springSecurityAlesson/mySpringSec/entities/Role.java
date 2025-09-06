package springSecurityAlesson.mySpringSec.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // Ex: "ROLE_USER", "ROLE_ADMIN"

    public Role(String name) {
        this.name = name;
    }
}