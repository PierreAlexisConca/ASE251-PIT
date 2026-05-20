package backend.PIT.service;

import backend.PIT.model.Seccion;
import backend.PIT.repository.SeccionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeccionService {
    private final SeccionRepository seccionRepository;

    public SeccionService(SeccionRepository seccionRepository) {
        this.seccionRepository = seccionRepository;
    }

    public List<Seccion> findAll() {
        return seccionRepository.findAll();
    }

    public Optional<Seccion> findById(Long id) {
        return seccionRepository.findById(id);
    }

    public Seccion save(Seccion seccion) {
        return seccionRepository.save(seccion);
    }

    public void deleteById(Long id) {
        seccionRepository.deleteById(id);
    }
}
