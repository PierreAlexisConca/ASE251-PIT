package backend.PIT.rest;

import backend.PIT.model.Proveedor;
import backend.PIT.service.ProveedorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:4200")
public class ProveedorRest {
    private final ProveedorService proveedorService;

    public ProveedorRest(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    public List<Proveedor> getAll() {
        return proveedorService.findAll();
    }

    @GetMapping("/{id}")
    public Proveedor getById(@PathVariable Long id) {
        return proveedorService.findById(id).orElse(null);
    }

    @PostMapping
    public Proveedor create(@RequestBody Proveedor proveedor) {
        return proveedorService.save(proveedor);
    }

    @PutMapping("/{id}")
    public Proveedor update(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        proveedor.setId(id);
        return proveedorService.save(proveedor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        proveedorService.deleteById(id);
    }
}
