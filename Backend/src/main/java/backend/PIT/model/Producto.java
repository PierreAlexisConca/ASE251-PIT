package backend.PIT.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codigo;
    private String nombre;
    private String detalle;
    @Enumerated(EnumType.STRING)
    private Categoria categoria;
    private Integer stock;
    private String unidad;
    private String seccion;
    @Enumerated(EnumType.STRING)
    private StockStatus status;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }
    public String getSeccion() { return seccion; }
    public void setSeccion(String seccion) { this.seccion = seccion; }
    public StockStatus getStatus() { return status; }
    public void setStatus(StockStatus status) { this.status = status; }
}
