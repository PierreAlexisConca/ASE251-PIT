package backend.PIT.rest;

import backend.PIT.model.Producto;
import backend.PIT.dto.ProductoDTO;
import backend.PIT.dto.CategoriaDTO;
import backend.PIT.dto.SeccionDTO;
import backend.PIT.model.Categoria;
import backend.PIT.model.Seccion;
import backend.PIT.service.ProductoService;
import backend.PIT.repository.CategoriaRepository;
import backend.PIT.repository.SeccionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {
    private final ProductoService productoService;
    private final CategoriaRepository categoriaRepository;
    private final SeccionRepository seccionRepository;

    public ProductoController(ProductoService productoService, CategoriaRepository categoriaRepository, SeccionRepository seccionRepository) {
        this.productoService = productoService;
        this.categoriaRepository = categoriaRepository;
        this.seccionRepository = seccionRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> getAll() {
        List<Producto> productos = productoService.findAll();
        List<ProductoDTO> dtos = productos.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getById(@PathVariable Long id) {
        Optional<Producto> productoOpt = productoService.findById(id);
        if (productoOpt.isPresent()) {
            return ResponseEntity.ok(toDTO(productoOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> create(@RequestBody ProductoDTO productoDTO) {
        try {
            Producto producto = fromDTO(productoDTO);
            Producto guardado = productoService.save(producto);
            return ResponseEntity.ok(toDTO(guardado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> update(@PathVariable Long id, @RequestBody ProductoDTO productoDTO) {
        if (!productoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Producto producto = fromDTO(productoDTO);
        producto.setId(id);
        Producto actualizado = productoService.save(producto);
        return ResponseEntity.ok(toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- MAPEO DTO ---
    private ProductoDTO toDTO(Producto producto) {
        CategoriaDTO categoriaDTO = null;
        if (producto.getCategoriaId() != null) {
            categoriaDTO = categoriaRepository.findById(producto.getCategoriaId())
                .map(cat -> new CategoriaDTO(cat.getId(), cat.getNombre()))
                .orElse(null);
        }
        SeccionDTO seccionDTO = null;
        if (producto.getSeccionId() != null) {
            seccionDTO = seccionRepository.findById(producto.getSeccionId())
                .map(sec -> new SeccionDTO(sec.getId(), sec.getNombre()))
                .orElse(null);
        }
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setCodigo(producto.getCodigo());
        dto.setNombre(producto.getNombre());
        dto.setDetalle(producto.getDetalle());
        dto.setCategoria(categoriaDTO);
        dto.setStock(producto.getStock());
        dto.setUnidad(producto.getUnidad());
        dto.setSeccion(seccionDTO);
        dto.setStatus(producto.getStatus());
        return dto;
    }

    private Producto fromDTO(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setId(dto.getId());
        producto.setCodigo(dto.getCodigo());
        producto.setNombre(dto.getNombre());
        producto.setDetalle(dto.getDetalle());
        producto.setCategoriaId(dto.getCategoria() != null ? dto.getCategoria().getId() : null);
        producto.setStock(dto.getStock());
        producto.setUnidad(dto.getUnidad());
        producto.setSeccionId(dto.getSeccion() != null ? dto.getSeccion().getId() : null);
        producto.setStatus(dto.getStatus());
        return producto;
    }
}
