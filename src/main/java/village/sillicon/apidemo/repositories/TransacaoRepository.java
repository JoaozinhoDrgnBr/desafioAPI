package village.sillicon.apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import village.sillicon.apidemo.models.Transacao;

import java.math.BigDecimal;

public interface TransacaoRepository extends JpaRepository<Transacao, Integer> {
    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t WHERE t.conta.idConta = :idConta AND t.tipoTransacao = 'SAQUE' AND DATE(t.dataTransacao) = CURRENT_DATE")
    BigDecimal totalSaquesDoDia(@Param("idConta") int idConta);
}
