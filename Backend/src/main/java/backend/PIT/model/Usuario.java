
package backend.PIT.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", length = 100, unique = true)
    private String username;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "nombre", length = 150)
    private String nombre;

    @Column(name = "rol", length = 50)
    private String rol;

    @Column(name = "activo")
    private Boolean activo;

    // --- Constructores ---
    public Usuario() {}

    public Usuario(String username, String password, String nombre, String rol, Boolean activo) {
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.rol = rol;
        this.activo = activo;
    }

    // --- Getters y Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}