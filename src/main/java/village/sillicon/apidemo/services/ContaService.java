package village.sillicon.apidemo.services;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import village.sillicon.apidemo.models.Conta;
import village.sillicon.apidemo.models.Pessoa;
import village.sillicon.apidemo.repositories.ContaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;

    public Conta criar(Conta conta) {
        return contaRepository.save(conta);
    }

    public List<Conta> listar() {
        return contaRepository.findAll();
    }

    public Conta acharPorId(int id) {
        return contaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada"));
    }

    public Conta atualizar(int id, Conta contaAtualizada) {
        Conta contaExistente = acharPorId(id);

        contaExistente.setFlagAtivo(contaAtualizada.getFlagAtivo());
        contaExistente.setSaldo(contaAtualizada.getSaldo());
        contaExistente.setLimiteSaqueDiario(contaAtualizada.getLimiteSaqueDiario());
        contaExistente.setTipoConta(contaAtualizada.getTipoConta());

        return contaRepository.save(contaExistente);
    }

    public void deletar(int id) {
        if (contaRepository.existsById(id)) {
            contaRepository.deleteById(id);
        }
    }
}
