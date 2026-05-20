package vallegrande.edu.pe.rest;

import vallegrande.edu.pe.model.Usuario;
import vallegrande.edu.pe.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
// 🟢 CAMBIO DE RUTA BASE: Ahora todos tus endpoints usarán '/api/login' en lugar de almacen
@RequestMapping("/api/login")
@CrossOrigin(origins = "*") // Permite la conexión directa con Angular sin bloqueos
// 🟢 NOMBRE DEL GRUPO EN SWAGGER: Cambia el antiguo 'usuario-rest' por un diseño limpio
@Tag(name = "login-api", description = "Mantenimiento completo de Usuarios conectado a SQL Server")
public class UsuarioRest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1. 🔵 GET - LISTAR TODOS LOS USUARIOS
    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Trae todos los registros guardados en tu SQL Server.")
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> lista = usuarioRepository.findAll();
        return ResponseEntity.ok(lista);
    }

    // 2. 🟢 POST - CREAR / REGISTRAR NUEVO USUARIO (Acepta cualquier dato)
    @PostMapping
    @Operation(summary = "Registrar nuevo usuario", description = "Guarda un usuario con cualquier letra, número o contraseña directo en la BD.")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        if (usuario.getEstado() == null) {
            usuario.setEstado(true); // Por defecto lo guarda como activo (1)
        }
        Usuario guardado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(guardado);
    }

    // 3. 🟠 PUT - MODIFICAR UN USUARIO EXISTENTE
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario por ID", description = "Modifica los datos de un usuario existente en SQL Server.")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Usuario datosNuevos) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setUsuario(datosNuevos.getUsuario());
            usuario.setContrasena(datosNuevos.getContrasena());
            usuario.setEstado(datosNuevos.getEstado());
            Usuario actualizado = usuarioRepository.save(usuario);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. 🟢 PATCH - RESTAURAR (ACTIVAR ESTADO = 1)
    @PatchMapping("/restaurar/{id}")
    @Operation(summary = "Restaurar usuario", description = "Cambia el estado del usuario a activo (1) en tu base de datos.")
    public ResponseEntity<?> restaurar(@PathVariable Integer id) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setEstado(true); // Activa el campo BIT a 1
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. 🟢 PATCH - ELIMINAR LÓGICO (DESACTIVAR ESTADO = 0)
    @PatchMapping("/eliminar/{id}")
    @Operation(summary = "Eliminar usuario (Lógico)", description = "Desactiva al usuario cambiando su estado a 0.")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setEstado(false); // Cambia el campo BIT a 0
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }).orElse(ResponseEntity.notFound().build());
    }
}