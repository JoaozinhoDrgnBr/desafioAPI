package village.sillicon.apidemo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import village.sillicon.apidemo.models.Pessoa;
import village.sillicon.apidemo.models.Transacao;
import village.sillicon.apidemo.repositories.TransacaoRepository;
import village.sillicon.apidemo.services.TransacaoService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {
    @Autowired
    private TransacaoService transacaoService;

    @PostMapping("saque/{id}/{valor}")
    public Transacao saque(@PathVariable int id, @PathVariable double valor) {
        BigDecimal valorConvertido = new BigDecimal(valor);
        return transacaoService.saque(id, valorConvertido);
    }

    @PostMapping("deposito/{id}/{valor}")
    public Transacao deposito(@PathVariable int id, @PathVariable double valor) {
        BigDecimal valorConvertido = new BigDecimal(valor);
        return transacaoService.deposito(id, valorConvertido);
    }

    @PostMapping("transferencia/{idRecebe}/{idEnvia}/{valor}")
    public Transacao transferencia(@PathVariable int idRecebe,
            @PathVariable int idEnvia, @PathVariable double valor) {
        BigDecimal valorConvertido = new BigDecimal(valor);
        return transacaoService.transferencia(idEnvia, idRecebe, valorConvertido);
    }

    @GetMapping("listar")
    public List<Transacao> listarTransacoes() {
        return transacaoService.listar();
    }

    @GetMapping("buscarPorId/{id}")
    public Transacao buscarPorId(@PathVariable int id) {
        return transacaoService.acharPorId(id);
    }

    @DeleteMapping("deletar/{id}")
    public void deletarTransacao(@PathVariable int id) {
        transacaoService.deletar(id);
    }
}
