package springSecurityAlesson.mySpringSec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import springSecurityAlesson.mySpringSec.entities.Role;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}