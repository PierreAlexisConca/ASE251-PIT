package vallegrande.edu.pe.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario") // Crucial para vincular la PK identity(1,1) de SQL Server
    private Integer id; // Cambiado a Integer para coincidir con INT de SQL Server

    @Column(name = "usuario", length = 100)
    private String usuario;

    @Column(name = "contrasena", length = 100)
    private String contrasena;

    @Column(name = "estado")
    private Boolean estado;

    // --- Constructores ---
    public Usuario() {}

    // Constructor para facilidad de registro
    public Usuario(String usuario, String contrasena, Boolean estado) {
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.estado = estado;
    }

    // --- Getters y Setters ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
}