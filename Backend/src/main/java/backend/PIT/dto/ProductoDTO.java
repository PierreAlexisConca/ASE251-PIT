package backend.PIT.dto;

import backend.PIT.dto.CategoriaDTO;
import backend.PIT.dto.SeccionDTO;

public class ProductoDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private String detalle;
    private CategoriaDTO categoria;
    private Integer stock;
    private String unidad;
    private SeccionDTO seccion;
    private String status;

    public ProductoDTO() {}

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
    public CategoriaDTO getCategoria() { return categoria; }
    public void setCategoria(CategoriaDTO categoria) { this.categoria = categoria; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }
    public SeccionDTO getSeccion() { return seccion; }
    public void setSeccion(SeccionDTO seccion) { this.seccion = seccion; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
