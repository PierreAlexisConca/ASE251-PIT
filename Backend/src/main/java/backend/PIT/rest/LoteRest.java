package backend.PIT.rest;

import backend.PIT.model.Lote;
import backend.PIT.dto.LoteDTO;
import backend.PIT.model.Producto;
import backend.PIT.repository.ProductoRepository;
import backend.PIT.service.LoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lotes")
@CrossOrigin(origins = "http://localhost:4200")
public class LoteRest {
    private final LoteService loteService;
    private final ProductoRepository productoRepository;

    public LoteRest(LoteService loteService, ProductoRepository productoRepository) {
        this.loteService = loteService;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public ResponseEntity<List<LoteDTO>> getAll() {
        List<Lote> lotes = loteService.findAll();
        List<LoteDTO> dtos = lotes.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoteDTO> getById(@PathVariable Long id) {
        Optional<Lote> loteOpt = loteService.findById(id);
        if (loteOpt.isPresent()) {
            return ResponseEntity.ok(toDTO(loteOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<LoteDTO> create(@RequestBody LoteDTO loteDTO) {
        try {
            Lote lote = fromDTO(loteDTO);
            Lote guardado = loteService.save(lote);
            return ResponseEntity.ok(toDTO(guardado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoteDTO> update(@PathVariable Long id, @RequestBody LoteDTO loteDTO) {
        if (!loteService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Lote lote = fromDTO(loteDTO);
        lote.setId(id);
        Lote actualizado = loteService.save(lote);
        return ResponseEntity.ok(toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!loteService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        loteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- MAPEO DTO ---
    private LoteDTO toDTO(Lote lote) {
        LoteDTO dto = new LoteDTO();
        dto.setId(lote.getId());
        dto.setCodigo(lote.getCodigo());
        dto.setDescripcion(lote.getDescripcion());
        dto.setProductoId(lote.getProductoId());
        if (lote.getProductoId() != null) {
            Optional<Producto> prod = productoRepository.findById(lote.getProductoId());
            dto.setProductoNombre(prod.map(Producto::getNombre).orElse(null));
        }
        dto.setCantidad(lote.getCantidad());
        dto.setFechaIngreso(lote.getFechaIngreso() != null ? lote.getFechaIngreso().toString() : null);
        dto.setFechaVencimiento(lote.getFechaVencimiento() != null ? lote.getFechaVencimiento().toString() : null);
        dto.setEstado(lote.getEstado());
        return dto;
    }

    private Lote fromDTO(LoteDTO dto) {
        Lote lote = new Lote();
        lote.setId(dto.getId());
        lote.setCodigo(dto.getCodigo());
        lote.setDescripcion(dto.getDescripcion());
        lote.setProductoId(dto.getProductoId());
        lote.setCantidad(dto.getCantidad());
        lote.setFechaIngreso(dto.getFechaIngreso());
        lote.setFechaVencimiento(dto.getFechaVencimiento());
        lote.setEstado(dto.getEstado());
        return lote;
    }
}
