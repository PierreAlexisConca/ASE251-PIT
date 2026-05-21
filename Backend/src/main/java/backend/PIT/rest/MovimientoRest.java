package backend.PIT.rest;

import backend.PIT.model.Movimiento;
import backend.PIT.dto.MovimientoDTO;
import backend.PIT.model.Producto;
import backend.PIT.repository.ProductoRepository;
import backend.PIT.service.MovimientoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "http://localhost:4200")
public class MovimientoRest {
    private final MovimientoService movimientoService;
    private final ProductoRepository productoRepository;

    public MovimientoRest(MovimientoService movimientoService, ProductoRepository productoRepository) {
        this.movimientoService = movimientoService;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public ResponseEntity<List<MovimientoDTO>> getAll() {
        List<Movimiento> movimientos = movimientoService.findAll();
        List<MovimientoDTO> dtos = movimientos.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoDTO> getById(@PathVariable Long id) {
        Optional<Movimiento> movOpt = movimientoService.findById(id);
        if (movOpt.isPresent()) {
            return ResponseEntity.ok(toDTO(movOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<MovimientoDTO> create(@RequestBody MovimientoDTO movimientoDTO) {
        try {
            Movimiento movimiento = fromDTO(movimientoDTO);
            Movimiento guardado = movimientoService.save(movimiento);
            return ResponseEntity.ok(toDTO(guardado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovimientoDTO> update(@PathVariable Long id, @RequestBody MovimientoDTO movimientoDTO) {
        if (!movimientoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Movimiento movimiento = fromDTO(movimientoDTO);
        movimiento.setId(id);
        Movimiento actualizado = movimientoService.save(movimiento);
        return ResponseEntity.ok(toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!movimientoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        movimientoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- MAPEO DTO ---
    private MovimientoDTO toDTO(Movimiento movimiento) {
        MovimientoDTO dto = new MovimientoDTO();
        dto.setId(movimiento.getId());
        dto.setTipo(movimiento.getTipo());
        dto.setProductoId(movimiento.getProductoId());
        if (movimiento.getProductoId() != null) {
            Optional<Producto> prod = productoRepository.findById(movimiento.getProductoId());
            dto.setProductoNombre(prod.map(Producto::getNombre).orElse(null));
        }
        dto.setCantidad(movimiento.getCantidad());
        // Convertir LocalDateTime a String si no es null
        dto.setFecha(movimiento.getFecha() != null ? movimiento.getFecha().toString() : null);
        dto.setObservacion(movimiento.getObservacion());
        return dto;
    }

    private Movimiento fromDTO(MovimientoDTO dto) {
        Movimiento movimiento = new Movimiento();
        movimiento.setId(dto.getId());
        movimiento.setTipo(dto.getTipo());
        movimiento.setProductoId(dto.getProductoId());
        movimiento.setCantidad(dto.getCantidad());
        movimiento.setFecha(dto.getFecha());
        movimiento.setObservacion(dto.getObservacion());
        return movimiento;
    }
}
