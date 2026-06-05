package backend.PIT.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos")
public class Movimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "usuario_id")
    private Long usuarioId;

    private String tipo;
    private Integer cantidad;
    private LocalDateTime fecha;
    private String nota;
    private String proveedor;
    private String documento;
    private String unidad;
    private String seccion;
    private String observaciones;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public void setFecha(String fecha) {
        this.fecha = (fecha != null && !fecha.isEmpty())
            ? LocalDateTime.parse(fecha.length() == 10 ? fecha + "T00:00:00" : fecha) : null;
    }
    public String getNota() { return nota; }
    public void setNota(String nota) { this.nota = nota; }
    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }
    public String getSeccion() { return seccion; }
    public void setSeccion(String seccion) { this.seccion = seccion; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    /** Alias para compatibilidad con MovimientoDTO que usa 'observacion' (sin 's') */
    public String getObservacion() { return observaciones; }
    public void setObservacion(String observacion) { this.observaciones = observacion; }
}
