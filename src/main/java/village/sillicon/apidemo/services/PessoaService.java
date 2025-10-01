package village.sillicon.apidemo.services;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import village.sillicon.apidemo.models.Pessoa;
import village.sillicon.apidemo.repositories.PessoaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PessoaService {

    @Autowired
    private PessoaRepository pessoaRepository;

    public Pessoa criar(Pessoa pessoa) {
        return pessoaRepository.save(pessoa);
    }

    public List<Pessoa> listar() {
        return pessoaRepository.findAll();
    }

    public Pessoa acharPorId(int id) {
        var pessoaExistente = pessoaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pessoa não encontrada"));

        Pessoa pessoa = new Pessoa();
        BeanUtils.copyProperties(pessoaExistente, pessoa);

        return pessoa;
    }

    public Pessoa atualizar(int id, Pessoa pessoaAtualizada) {
        Pessoa pessoaExistente = acharPorId(id);

        pessoaExistente.setNome(pessoaAtualizada.getNome());
        pessoaExistente.setCpf(pessoaAtualizada.getCpf());
        pessoaExistente.setDataNascimento(pessoaAtualizada.getDataNascimento());

        return pessoaRepository.save(pessoaExistente);
    }

    public void deletar(int id) {
        if (pessoaRepository.existsById(id)) {
            pessoaRepository.deleteById(id);
        }
    }
}