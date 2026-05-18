package backend.PIT.repository;

import backend.PIT.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    @Query(value = "SELECT COALESCE(SUM(cantidad),0) FROM movimientos WHERE tipo = 'Entrada' AND fecha BETWEEN :from AND :to", nativeQuery = true)
    Long sumEntradasBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT COALESCE(SUM(cantidad),0) FROM movimientos WHERE tipo = 'Salida' AND fecha BETWEEN :from AND :to", nativeQuery = true)
    Long sumSalidasBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT producto_id FROM movimientos WHERE fecha BETWEEN :from AND :to GROUP BY producto_id", nativeQuery = true)
    List<Long> findDistinctProductoIdsBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT MONTH(fecha) as m, SUM(CASE WHEN tipo='Entrada' THEN cantidad ELSE 0 END) as entradas, SUM(CASE WHEN tipo='Salida' THEN cantidad ELSE 0 END) as salidas FROM movimientos WHERE YEAR(fecha)=:year GROUP BY MONTH(fecha) ORDER BY m", nativeQuery = true)
    List<Object[]> aggregateMonthly(@Param("year") int year);

    @Query(value = "SELECT p.id, p.nombre, p.categoria, COALESCE(SUM(CASE WHEN m.tipo='Entrada' THEN m.cantidad ELSE 0 END),0) as entradas, COALESCE(SUM(CASE WHEN m.tipo='Salida' THEN m.cantidad ELSE 0 END),0) as salidas FROM movimientos m JOIN productos p ON m.producto_id = p.id WHERE m.fecha BETWEEN :from AND :to GROUP BY p.id, p.nombre, p.categoria ORDER BY (COALESCE(SUM(CASE WHEN m.tipo='Entrada' THEN m.cantidad ELSE 0 END),0) - COALESCE(SUM(CASE WHEN m.tipo='Salida' THEN m.cantidad ELSE 0 END),0)) DESC", nativeQuery = true)
    List<Object[]> topProductsBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT p.categoria, COUNT(DISTINCT p.id) as productos, COALESCE(SUM(m.cantidad),0) as movimientos FROM movimientos m JOIN productos p ON m.producto_id = p.id WHERE m.fecha BETWEEN :from AND :to GROUP BY p.categoria", nativeQuery = true)
    List<Object[]> distributionByCategory(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
