package village.sillicon.apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import village.sillicon.apidemo.models.Conta;

public interface ContaRepository extends JpaRepository<Conta, Integer> {

}
