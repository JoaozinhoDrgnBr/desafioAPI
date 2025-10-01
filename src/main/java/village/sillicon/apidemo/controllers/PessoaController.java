package village.sillicon.apidemo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import village.sillicon.apidemo.models.Pessoa;
import village.sillicon.apidemo.services.PessoaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pessoas")
public class PessoaController {
    @Autowired
    private PessoaService pessoaService;

    // Criar nova pessoa
    @PostMapping("criar")
    public Pessoa criarPessoa(@RequestBody Pessoa pessoa) {
        return pessoaService.criar(pessoa);
    }

    // Listar todas as pessoas
    @GetMapping("listar")
    public List<Pessoa> listarPessoas() {
        return pessoaService.listar();
    }

    // Buscar pessoa por ID
    @GetMapping("buscarPorId/{id}")
    public Pessoa buscarPorId(@PathVariable int id) {
        return pessoaService.acharPorId(id);
    }

    // Atualizar pessoa
    @PutMapping("atualizar/{id}")
    public Pessoa atualizarPessoa(@PathVariable int id, @RequestBody Pessoa pessoaAtualizada) {
        return pessoaService.atualizar(id, pessoaAtualizada);
    }

    // Deletar pessoa
    @DeleteMapping("deletar/{id}")
    public void deletarPessoa(@PathVariable int id) {
        pessoaService.deletar(id);
    }
}
