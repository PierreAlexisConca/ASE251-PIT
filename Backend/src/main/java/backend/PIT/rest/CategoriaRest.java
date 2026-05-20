package backend.PIT.rest;

import backend.PIT.model.Categoria;
import backend.PIT.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoriaRest {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<Categoria>> listarTodos() {
        return ResponseEntity.ok(categoriaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerPorId(@PathVariable Long id) {
        Optional<Categoria> categoria = categoriaService.findById(id);
        return categoria.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categoria> registrar(@RequestBody Categoria categoria) {
        Categoria guardado = categoriaService.save(categoria);
        return ResponseEntity.ok(guardado);
    }

    /**
     * @param id
     * @param datosNuevos
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @RequestBody Categoria datosNuevos) {
        return categoriaService.findById(id).map(categoria -> {
            categoria.setNombre(datosNuevos.getNombre());
            // Agrega aquí otros campos si existen
            Categoria actualizado = categoriaService.save(categoria);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        categoriaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
