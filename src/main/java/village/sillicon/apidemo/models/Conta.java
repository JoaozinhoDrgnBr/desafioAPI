package village.sillicon.apidemo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Contas")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idConta;

    // Muitas contas podem pertencer a uma pessoa
    @ManyToOne
    @JoinColumn(name = "idPessoa", nullable = false)
    private Pessoa pessoa;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal saldo;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal limiteSaqueDiario;

    @Column(nullable = false)
    private Boolean flagAtivo = true;

    @Column(nullable = false)
    private int tipoConta;

    @Column(updatable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    public Conta() {
    }

    public Conta(Pessoa pessoa, BigDecimal saldo, BigDecimal limiteSaqueDiario,
            Boolean flagAtivo, int tipoConta) {

        this.pessoa = pessoa;
        this.saldo = saldo;
        this.limiteSaqueDiario = limiteSaqueDiario;
        this.flagAtivo = flagAtivo;
        this.tipoConta = tipoConta;
    }

    // Getters e Setters
    public int getIdConta() {
        return idConta;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public BigDecimal getLimiteSaqueDiario() {
        return limiteSaqueDiario;
    }

    public void setLimiteSaqueDiario(BigDecimal limiteSaqueDiario) {
        this.limiteSaqueDiario = limiteSaqueDiario;
    }

    public Boolean getFlagAtivo() {
        return flagAtivo;
    }

    public void setFlagAtivo(Boolean flagAtivo) {
        this.flagAtivo = flagAtivo;
    }

    public int getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(int tipoConta) {
        this.tipoConta = tipoConta;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    @Override
    public String toString() {
        return "Conta{" +
                "idConta=" + idConta +
                ", pessoa=" + pessoa.getNome() +
                ", saldo=" + saldo +
                ", limiteSaqueDiario=" + limiteSaqueDiario +
                ", flagAtivo=" + flagAtivo +
                ", tipoConta=" + tipoConta +
                ", dataCriacao=" + dataCriacao +
                '}';
    }
}
