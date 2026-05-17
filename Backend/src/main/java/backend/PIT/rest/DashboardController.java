package backend.PIT.rest;

import backend.PIT.model.DashboardResumen;
import backend.PIT.model.Producto;
import backend.PIT.service.ProductoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {
    private final ProductoService productoService;

    public DashboardController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public DashboardResumen getResumen() {
        List<Producto> productos = productoService.findAll();
        DashboardResumen resumen = new DashboardResumen();
        resumen.setTotalProductos(productos.size());
        resumen.setProductosBajoStock((int) productos.stream().filter(p -> p.getStatus() != null && p.getStatus().name().equals("BAJO")).count());
        resumen.setProductosPorVencer((int) productos.stream().filter(p -> p.getStatus() != null && p.getStatus().name().equals("POR_VENCER")).count());
        resumen.setProductosCriticos((int) productos.stream().filter(p -> p.getStatus() != null && p.getStatus().name().equals("CRITICO")).count());
        return resumen;
    }
}
