package village.sillicon.apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import village.sillicon.apidemo.models.Transacao;

public interface TransacaoRepository extends JpaRepository<Transacao, Integer> {

}
