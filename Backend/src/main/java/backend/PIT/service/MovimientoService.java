package backend.PIT.service;

import backend.PIT.model.Movimiento;
import backend.PIT.model.Producto;
import backend.PIT.repository.MovimientoRepository;
import backend.PIT.repository.ProductoRepository;
import backend.PIT.repository.SeccionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MovimientoService {
    private final MovimientoRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final SeccionRepository seccionRepository;

    public MovimientoService(MovimientoRepository movimientoRepository, ProductoRepository productoRepository, SeccionRepository seccionRepository) {
        this.movimientoRepository = movimientoRepository;
        this.productoRepository = productoRepository;
        this.seccionRepository = seccionRepository;
    }

    public Long sumEntradasBetween(LocalDateTime from, LocalDateTime to) {
        System.out.println("DEBUG Service sumEntradasBetween: from=" + from + ", to=" + to);
        return movimientoRepository.sumEntradasBetween(from, to);
    }

    public Long sumSalidasBetween(LocalDateTime from, LocalDateTime to) {
        System.out.println("DEBUG Service sumSalidasBetween: from=" + from + ", to=" + to);
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
        normalizeMovimiento(movimiento);

        Optional<Movimiento> anterior = movimiento.getId() != null
            ? movimientoRepository.findById(movimiento.getId())
            : Optional.empty();

        anterior.ifPresent(this::revertStockEffect);
        applyStockEffect(movimiento);

        return movimientoRepository.save(movimiento);
    }

    public void deleteById(Long id) {
        movimientoRepository.findById(id).ifPresent(this::revertStockEffect);
        movimientoRepository.deleteById(id);
    }

    private void normalizeMovimiento(Movimiento movimiento) {
        if (movimiento.getFecha() == null) {
            movimiento.setFecha(LocalDateTime.now());
        }

        if (movimiento.getTipo() == null) {
            throw new IllegalArgumentException("El tipo de movimiento es obligatorio");
        }

        String tipoNormalizado = movimiento.getTipo().trim();
        boolean valid = false;
        if (tipoNormalizado.equalsIgnoreCase("entrada")) {
            movimiento.setTipo("Entrada");
            valid = true;
        } else if (tipoNormalizado.equalsIgnoreCase("salida")) {
            movimiento.setTipo("Salida");
            valid = true;
        }

        if (!valid) {
            throw new IllegalArgumentException("Tipo de movimiento no valido");
        }

        if (movimiento.getProductoId() != null) {
            Producto producto = productoRepository.findById(movimiento.getProductoId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

            if (movimiento.getUnidad() == null || movimiento.getUnidad().trim().isEmpty()) {
                movimiento.setUnidad(producto.getUnidad());
            }

            if (producto.getSeccionId() != null && (movimiento.getSeccion() == null || movimiento.getSeccion().trim().isEmpty())) {
                seccionRepository.findById(producto.getSeccionId()).ifPresent(seccion -> {
                    movimiento.setSeccion(seccion.getNombre());
                });
            }
        }
    }

    private void applyStockEffect(Movimiento movimiento) {
        if (movimiento.getProductoId() == null || movimiento.getCantidad() == null) {
            throw new IllegalArgumentException("Producto y cantidad son obligatorios");
        }

        Producto producto = productoRepository.findById(movimiento.getProductoId())
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        int stockActual = producto.getStock() != null ? producto.getStock() : 0;
        int ajuste = movimiento.getTipo().equals("Entrada") ? movimiento.getCantidad() : -movimiento.getCantidad();
        int nuevoStock = stockActual + ajuste;

        if (nuevoStock < 0) {
            throw new IllegalArgumentException("Stock insuficiente para registrar la salida");
        }

        producto.setStock(nuevoStock);
        productoRepository.save(producto);
    }

    private void revertStockEffect(Movimiento movimiento) {
        if (movimiento.getProductoId() == null || movimiento.getCantidad() == null || movimiento.getTipo() == null) {
            return;
        }

        productoRepository.findById(movimiento.getProductoId()).ifPresent(producto -> {
            int stockActual = producto.getStock() != null ? producto.getStock() : 0;
            int ajuste = movimiento.getTipo().equalsIgnoreCase("Entrada") ? -movimiento.getCantidad() : movimiento.getCantidad();
            producto.setStock(Math.max(stockActual + ajuste, 0));
            productoRepository.save(producto);
        });
    }
}
