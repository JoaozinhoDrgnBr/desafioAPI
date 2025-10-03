package village.sillicon.apidemo.services;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import village.sillicon.apidemo.models.Conta;
import village.sillicon.apidemo.models.Pessoa;
import village.sillicon.apidemo.models.Transacao;
import village.sillicon.apidemo.models.Transacao.TipoTransacao;
import village.sillicon.apidemo.repositories.ContaRepository;
import village.sillicon.apidemo.repositories.TransacaoRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;
    @Autowired
    private ContaService contaService;

    public Transacao criar(Transacao transacao) {
        return transacaoRepository.save(transacao);
    }

    public Transacao saque(int idConta, BigDecimal valor) {
        Conta conta = contaService.acharPorId(idConta);
        if (validarTransacao(conta, TipoTransacao.SAQUE, valor) == true) {
            conta.setSaldo(conta.getSaldo().subtract(valor));
            contaService.atualizar(idConta, conta);
            Transacao transacao = new Transacao(conta, valor, TipoTransacao.SAQUE);
            return criar(transacao);
        }
        throw new RuntimeException("Não foi possível realizar saque");
    }

    public Transacao deposito(int idConta, BigDecimal valor) {
        Conta conta = contaService.acharPorId(idConta);
        if (validarTransacao(conta, TipoTransacao.DEPOSITO, valor) == true) {
            conta.setSaldo(conta.getSaldo().add(valor));
            contaService.atualizar(idConta, conta);
            Transacao transacao = new Transacao(conta, valor, TipoTransacao.DEPOSITO);
            return criar(transacao);
        }
        throw new RuntimeException("Não foi possível realizar deposito");
    }

    public Transacao transferencia(int idContaEnvia, int idContaRecebe, BigDecimal valor) {
        Conta contaEnvia = contaService.acharPorId(idContaEnvia);
        Conta contaRecebe = contaService.acharPorId(idContaRecebe);
        if ((validarTransacao(contaEnvia, TipoTransacao.TRANSFERENCIA_ENVIADA, valor) == true)
                && (validarTransacao(contaRecebe, TipoTransacao.TRANSFERENCIA_RECEBIDA, valor) == true)) {
            // Conta que vai enviar o dinheiro
            contaEnvia.setSaldo(contaEnvia.getSaldo().subtract(valor));
            contaService.atualizar(idContaEnvia, contaEnvia);
            Transacao transacaoEnviada = new Transacao(contaEnvia, valor, TipoTransacao.TRANSFERENCIA_ENVIADA);
            criar(transacaoEnviada);

            // Conta que vai receber o dinheiro
            contaRecebe.setSaldo(contaRecebe.getSaldo().add(valor));
            contaService.atualizar(idContaRecebe, contaRecebe);
            Transacao transacaoRecebida = new Transacao(contaRecebe, valor, TipoTransacao.TRANSFERENCIA_RECEBIDA);
            return criar(transacaoRecebida);
        }
        throw new RuntimeException("Não foi possível realizar transação");
    }

    // valida se a conta está bloqueada ou não
    // valida limite diario, se há uma um saque no dia subtrai do limite diario
    // valida se há saldo suficiente
    // valida a conta que irá enviar a transferência
    public Boolean validarTransacao(Conta conta, TipoTransacao tipoTransacao, BigDecimal valor) {
        if (conta.getFlagAtivo() == false) {
            throw new RuntimeException("Conta bloqueada");
        }

        switch (tipoTransacao) {

            // checar limite e se há dinheiro suficiente
            case SAQUE:
                if (valor.compareTo(conta.getSaldo()) > 0) {
                    throw new RuntimeException("Valor maior que saldo");
                }

                BigDecimal totalSaquesHoje = transacaoRepository.totalSaquesDoDia(conta.getIdConta());
                if (totalSaquesHoje.add(valor).compareTo(conta.getLimiteSaqueDiario()) > 0) {
                    throw new RuntimeException("Limite de saque diário excedido");
                }
                break;

            case TRANSFERENCIA_ENVIADA:
                if (valor.compareTo(conta.getSaldo()) > 0) {
                    throw new RuntimeException("Valor maior que saldo");
                }
                break;

            // Depositos e receber transferencias
            default:
                return true;
        }
        return true;
    }

    public List<Transacao> listar() {
        return transacaoRepository.findAll();
    }

    public Transacao acharPorId(int id) {
        var transacaoExistente = transacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transacao não encontrada"));

        Transacao transacao = new Transacao();
        BeanUtils.copyProperties(transacaoExistente, transacao);

        return transacao;
    }

    public void deletar(int id) {
        if (transacaoRepository.existsById(id)) {
            transacaoRepository.deleteById(id);
        }
    }
}
