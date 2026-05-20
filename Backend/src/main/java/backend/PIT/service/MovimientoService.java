package backend.PIT.service;

import backend.PIT.model.Movimiento;
import backend.PIT.repository.MovimientoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimientoService {
    private final MovimientoRepository movimientoRepository;

    public MovimientoService(MovimientoRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

    public Long sumEntradasBetween(LocalDateTime from, LocalDateTime to) {
        return movimientoRepository.sumEntradasBetween(from, to);
    }

    public Long sumSalidasBetween(LocalDateTime from, LocalDateTime to) {
        return movimientoRepository.sumSalidasBetween(from, to);
    }

    public List<Long> distinctProductoIdsBetween(LocalDateTime from, LocalDateTime to) {
        return movimientoRepository.findDistinctProductoIdsBetween(from, to);
    }

    public List<Object[]> aggregateMonthly(int year) {
        return movimientoRepository.aggregateMonthly(year);
    }

    public List<Object[]> topProductsBetween(LocalDateTime from, LocalDateTime to) {
        return movimientoRepository.topProductsBetween(from, to);
    }

    public List<Object[]> distributionByCategory(LocalDateTime from, LocalDateTime to) {
        return movimientoRepository.distributionByCategory(from, to);
    }

    public List<Movimiento> findAll() {
        return movimientoRepository.findAll();
    }

    public java.util.Optional<Movimiento> findById(Long id) {
        return movimientoRepository.findById(id);
    }

    public Movimiento save(Movimiento movimiento) {
        return movimientoRepository.save(movimiento);
    }

    public void deleteById(Long id) {
        movimientoRepository.deleteById(id);
    }
}
