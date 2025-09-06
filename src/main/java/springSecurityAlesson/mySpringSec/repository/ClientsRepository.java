package springSecurityAlesson.mySpringSec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import springSecurityAlesson.mySpringSec.entities.Client;

import java.time.LocalDateTime;

public interface ClientsRepository extends JpaRepository<Client, Long> {


    // Conta quantos clientes foram criados a partir de uma certa data
    Long countByCreatedAtAfter(LocalDateTime date);
}
