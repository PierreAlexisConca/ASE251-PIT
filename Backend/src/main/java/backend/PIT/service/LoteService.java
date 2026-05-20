package backend.PIT.service;

import backend.PIT.model.Lote;
import backend.PIT.repository.LoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoteService {
    private final LoteRepository loteRepository;

    public LoteService(LoteRepository loteRepository) {
        this.loteRepository = loteRepository;
    }

    public List<Lote> findAll() {
        return loteRepository.findAll();
    }

    public Optional<Lote> findById(Long id) {
        return loteRepository.findById(id);
    }

    public Lote save(Lote lote) {
        return loteRepository.save(lote);
    }

    public void deleteById(Long id) {
        loteRepository.deleteById(id);
    }
}
