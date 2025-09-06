package springSecurityAlesson.mySpringSec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import springSecurityAlesson.mySpringSec.entities.LogAtividade;
import java.util.List;

public interface LogAtividadeRepository extends JpaRepository<LogAtividade, Long> {
    // Busca os logs ordenando pelos mais recentes
    List<LogAtividade> findAllByOrderByDataHoraDesc();
}