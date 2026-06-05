package backend.PIT.rest;

import backend.PIT.dto.MovimientoDTO;
import backend.PIT.model.DashboardResumen;
import backend.PIT.model.Movimiento;
import backend.PIT.model.Producto;
import backend.PIT.repository.ProductoRepository;
import backend.PIT.service.MovimientoService;
import backend.PIT.service.ProductoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {
    private final ProductoService productoService;
    private final MovimientoService movimientoService;
    private final ProductoRepository productoRepository;

    public DashboardController(ProductoService productoService, MovimientoService movimientoService, ProductoRepository productoRepository) {
        this.productoService = productoService;
        this.movimientoService = movimientoService;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public DashboardResumen getResumen() {
        List<Producto> productos = productoService.findAll();
        DashboardResumen resumen = new DashboardResumen();
        resumen.setTotalProductos(productos.size());
        // Calcular dinámicamente basado en stock (no depende del campo status estático)
        resumen.setProductosBajoStock((int) productos.stream()
            .filter(p -> p.getStock() != null && p.getStock() > 50 && p.getStock() <= 100).count());
        resumen.setProductosPorVencer((int) productos.stream()
            .filter(p -> p.getStock() != null && p.getStock() > 100 && p.getStock() <= 350).count());
        resumen.setProductosCriticos((int) productos.stream()
            .filter(p -> p.getStock() != null && p.getStock() <= 50).count());
        return resumen;
    }

    @GetMapping("/movimientos-recientes")
    public List<Map<String, Object>> getMovimientosRecientes() {
        List<Movimiento> todos = movimientoService.findAll();
        // Tomar los últimos 10 ordenados por id desc
        return todos.stream()
            .sorted((a, b) -> {
                long idA = a.getId() != null ? a.getId() : 0;
                long idB = b.getId() != null ? b.getId() : 0;
                return Long.compare(idB, idA);
            })
            .limit(10)
            .map(m -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", m.getId());
                map.put("tipo", m.getTipo());
                map.put("cantidad", m.getCantidad());
                map.put("unidad", m.getUnidad());
                map.put("fecha", m.getFecha() != null ? m.getFecha().toString() : null);
                map.put("proveedor", m.getProveedor());
                if (m.getProductoId() != null) {
                    Optional<Producto> prod = productoRepository.findById(m.getProductoId());
                    map.put("productoNombre", prod.map(Producto::getNombre).orElse("N/A"));
                } else {
                    map.put("productoNombre", "N/A");
                }
                return map;
            })
            .collect(Collectors.toList());
    }
}
