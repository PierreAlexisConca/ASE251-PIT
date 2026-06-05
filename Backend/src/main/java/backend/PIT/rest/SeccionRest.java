package backend.PIT.rest;

import backend.PIT.model.Seccion;
import backend.PIT.dto.SeccionDTO;
import backend.PIT.service.SeccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/secciones")
@CrossOrigin(origins = "http://localhost:4200")
public class SeccionRest {
    private final SeccionService seccionService;

    public SeccionRest(SeccionService seccionService) {
        this.seccionService = seccionService;
    }

    @GetMapping
    public ResponseEntity<List<SeccionDTO>> getAll() {
        List<Seccion> secciones = seccionService.findAll();
        List<SeccionDTO> dtos = secciones.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeccionDTO> getById(@PathVariable Long id) {
        Optional<Seccion> seccionOpt = seccionService.findById(id);
        if (seccionOpt.isPresent()) {
            return ResponseEntity.ok(toDTO(seccionOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<SeccionDTO> create(@RequestBody SeccionDTO seccionDTO) {
        try {
            Seccion seccion = fromDTO(seccionDTO);
            Seccion guardado = seccionService.save(seccion);
            return ResponseEntity.ok(toDTO(guardado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeccionDTO> update(@PathVariable Long id, @RequestBody SeccionDTO seccionDTO) {
        if (!seccionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Seccion seccion = fromDTO(seccionDTO);
        seccion.setId(id);
        Seccion actualizado = seccionService.save(seccion);
        return ResponseEntity.ok(toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!seccionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        seccionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- MAPEO DTO ---
    private SeccionDTO toDTO(Seccion seccion) {
        SeccionDTO dto = new SeccionDTO();
        dto.setId(seccion.getId());
        dto.setNombre(seccion.getNombre());
        dto.setCapacidad(seccion.getCapacidad());
        return dto;
    }

    private Seccion fromDTO(SeccionDTO dto) {
        Seccion seccion = new Seccion();
        seccion.setId(dto.getId());
        seccion.setNombre(dto.getNombre());
        seccion.setCapacidad(dto.getCapacidad());
        return seccion;
    }
}
