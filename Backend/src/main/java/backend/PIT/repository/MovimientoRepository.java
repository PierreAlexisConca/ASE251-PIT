package backend.PIT.repository;

import backend.PIT.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    @Query(value = "SELECT COALESCE(SUM(cantidad),0) FROM movimientos WHERE UPPER(tipo) = 'ENTRADA' AND fecha BETWEEN :from AND :to", nativeQuery = true)
    Long sumEntradasBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT COALESCE(SUM(cantidad),0) FROM movimientos WHERE UPPER(tipo) = 'SALIDA' AND fecha BETWEEN :from AND :to", nativeQuery = true)
    Long sumSalidasBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT producto_id FROM movimientos WHERE fecha BETWEEN :from AND :to GROUP BY producto_id", nativeQuery = true)
    List<Long> findDistinctProductoIdsBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT MONTH(fecha) as m, SUM(CASE WHEN UPPER(tipo)='ENTRADA' THEN cantidad ELSE 0 END) as entradas, SUM(CASE WHEN UPPER(tipo)='SALIDA' THEN cantidad ELSE 0 END) as salidas FROM movimientos WHERE YEAR(fecha)=:year GROUP BY MONTH(fecha) ORDER BY m", nativeQuery = true)
    List<Object[]> aggregateMonthly(@Param("year") int year);

    @Query(value = "SELECT p.id, p.nombre, c.nombre as categoria, COALESCE(SUM(CASE WHEN UPPER(m.tipo)='ENTRADA' THEN m.cantidad ELSE 0 END),0) as entradas, COALESCE(SUM(CASE WHEN UPPER(m.tipo)='SALIDA' THEN m.cantidad ELSE 0 END),0) as salidas FROM movimientos m JOIN productos p ON m.producto_id = p.id LEFT JOIN categorias c ON p.categoria_id = c.id WHERE m.fecha BETWEEN :from AND :to GROUP BY p.id, p.nombre, c.nombre ORDER BY (COALESCE(SUM(CASE WHEN UPPER(m.tipo)='ENTRADA' THEN m.cantidad ELSE 0 END),0) + COALESCE(SUM(CASE WHEN UPPER(m.tipo)='SALIDA' THEN m.cantidad ELSE 0 END),0)) DESC", nativeQuery = true)
    List<Object[]> topProductsBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT c.nombre as categoria, COUNT(DISTINCT p.id) as productos, COALESCE(SUM(m.cantidad),0) as movimientos FROM movimientos m JOIN productos p ON m.producto_id = p.id LEFT JOIN categorias c ON p.categoria_id = c.id WHERE m.fecha BETWEEN :from AND :to GROUP BY c.nombre", nativeQuery = true)
    List<Object[]> distributionByCategory(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
