package springSecurityAlesson.mySpringSec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import springSecurityAlesson.mySpringSec.entities.Products;

import java.util.List;

public interface ProductsRepository extends JpaRepository<Products, Long> {

    Long countByQuantidadeLessThanEqual(Integer quantidade);
    List<Products> findByQuantidadeLessThanEqual(Integer quantidade);
}
