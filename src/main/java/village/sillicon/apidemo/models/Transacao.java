package village.sillicon.apidemo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Transacoes")
public class Transacao {

    public enum TipoTransacao {
        DEPOSITO,
        SAQUE,
        TRANSFERENCIA_ENVIADA,
        TRANSFERENCIA_RECEBIDA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idTransacao;

    // Muitas transações podem estar ligadas a uma conta
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "idConta", nullable = false)
    private Conta conta;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransacao tipoTransacao;

    @Column(updatable = false)
    private LocalDateTime dataTransacao = LocalDateTime.now();

    public Transacao() {
    }

    public Transacao(Conta conta, BigDecimal valor, TipoTransacao tipoTransacao) {

        this.conta = conta;
        this.tipoTransacao = tipoTransacao;
        this.valor = valor;
    }

    // Getters e Setters
    public int getIdTransacao() {
        return idTransacao;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public TipoTransacao getTipoTransacao() {
        return tipoTransacao;
    }

    public void setTipoTransacao(TipoTransacao tipoTransacao) {
        this.tipoTransacao = tipoTransacao;
    }

    public LocalDateTime getDataTransacao() {
        return dataTransacao;
    }

    @Override
    public String toString() {
        return "Transacao{" +
                "idTransacao=" + idTransacao +
                ", conta=" + conta.getIdConta() +
                ", valor=" + valor +
                ", tipoTransacao=" + tipoTransacao +
                ", dataTransacao=" + dataTransacao +
                '}';
    }
}
