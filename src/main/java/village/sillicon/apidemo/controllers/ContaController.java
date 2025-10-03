package village.sillicon.apidemo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import village.sillicon.apidemo.models.Conta;
import village.sillicon.apidemo.services.ContaService;

import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/contas")
public class ContaController {
    @Autowired
    private ContaService contaService;

    @PostMapping("criar")
    public Conta criarConta(@RequestBody Conta conta) {
        return contaService.criar(conta);
    }

    @GetMapping("listar")
    public List<Conta> listarContas() {
        return contaService.listar();
    }

    @GetMapping("buscarPorId/{id}")
    public Conta buscarPorId(@PathVariable int id) {
        return contaService.acharPorId(id);
    }

    @PutMapping("atualizar/{id}")
    public Conta atualizarConta(@PathVariable int id, @RequestBody Conta contaAtualizada) {
        return contaService.atualizar(id, contaAtualizada);
    }

    @DeleteMapping("deletar/{id}")
    public void deletarConta(@PathVariable int id) {
        contaService.deletar(id);
    }
}
