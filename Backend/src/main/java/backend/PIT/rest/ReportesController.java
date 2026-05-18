package backend.PIT.rest;

import backend.PIT.service.MovimientoService;
import backend.PIT.service.ProductoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportesController {
    private final MovimientoService movimientoService;
    private final ProductoService productoService;

    public ReportesController(MovimientoService movimientoService, ProductoService productoService) {
        this.movimientoService = movimientoService;
        this.productoService = productoService;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        LocalDateTime f = from.atStartOfDay();
        LocalDateTime t = to.atTime(LocalTime.MAX);
        long entradas = Optional.ofNullable(movimientoService.sumEntradasBetween(f, t)).orElse(0L);
        long salidas = Optional.ofNullable(movimientoService.sumSalidasBetween(f, t)).orElse(0L);
        List<Long> productosConMov = movimientoService.distinctProductoIdsBetween(f, t);
        Map<String, Object> res = new HashMap<>();
        res.put("totalEntradas", entradas);
        res.put("totalSalidas", salidas);
        res.put("saldo", entradas - salidas);
        res.put("productosConMovimiento", productosConMov.size());
        return res;
    }

    @GetMapping("/monthly")
    public List<Map<String, Object>> monthly(@RequestParam int year) {
        List<Object[]> rows = movimientoService.aggregateMonthly(year);
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", ((Number) r[0]).intValue());
            m.put("entradas", ((Number) r[1]).longValue());
            m.put("salidas", ((Number) r[2]).longValue());
            out.add(m);
        }
        return out;
    }

    @GetMapping("/distribution")
    public List<Map<String, Object>> distribution(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        LocalDateTime f = from.atStartOfDay();
        LocalDateTime t = to.atTime(LocalTime.MAX);
        List<Object[]> rows = movimientoService.distributionByCategory(f, t);
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new HashMap<>();
            m.put("categoria", r[0]);
            m.put("productos", ((Number) r[1]).intValue());
            m.put("movimientos", ((Number) r[2]).longValue());
            out.add(m);
        }
        return out;
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> topProducts(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "5") int limit
    ) {
        LocalDateTime f = from.atStartOfDay();
        LocalDateTime t = to.atTime(LocalTime.MAX);
        List<Object[]> rows = movimientoService.topProductsBetween(f, t);
        List<Map<String, Object>> out = new ArrayList<>();
        for (int i = 0; i < Math.min(rows.size(), limit); i++) {
            Object[] r = rows.get(i);
            Map<String, Object> m = new HashMap<>();
            m.put("productoId", ((Number) r[0]).longValue());
            m.put("nombre", r[1]);
            m.put("categoria", r[2]);
            m.put("entradas", ((Number) r[3]).longValue());
            m.put("salidas", ((Number) r[4]).longValue());
            m.put("saldo", ((Number) r[3]).longValue() - ((Number) r[4]).longValue());
            out.add(m);
        }
        return out;
    }
}
