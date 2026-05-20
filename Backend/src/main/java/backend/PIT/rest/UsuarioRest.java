package backend.PIT.rest;

import backend.PIT.model.Usuario;
import backend.PIT.dto.UsuarioLoginDTO;
import backend.PIT.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "usuarios-api", description = "Mantenimiento de Usuarios para PIT")
public class UsuarioRest {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Trae todos los usuarios.")
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo usuario", description = "Guarda un usuario en la BD.")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
        Usuario guardado = usuarioService.save(usuario);
        return ResponseEntity.ok(guardado);
    }

    @PostMapping("/login")
    @Operation(summary = "Login de usuario", description = "Valida usuario y contraseña.")
    public ResponseEntity<Usuario> login(@RequestBody UsuarioLoginDTO loginDTO) {
        System.out.println("[LOGIN] username recibido: '" + loginDTO.getUsername() + "'");
        System.out.println("[LOGIN] password recibido: '" + loginDTO.getPassword() + "'");
        Optional<Usuario> encontrado = usuarioService.validarLogin(loginDTO.getUsername(), loginDTO.getPassword());
        if (encontrado.isPresent()) {
            System.out.println("[LOGIN] Usuario autenticado correctamente: " + loginDTO.getUsername());
        } else {
            System.out.println("[LOGIN] Fallo de autenticación para: " + loginDTO.getUsername());
        }
        return encontrado.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario por ID", description = "Modifica los datos de un usuario existente.")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario datosNuevos) {
        return usuarioService.findById(id).map(usuario -> {
            usuario.setUsername(datosNuevos.getUsername());
            usuario.setPassword(datosNuevos.getPassword());
            usuario.setNombre(datosNuevos.getNombre());
            usuario.setRol(datosNuevos.getRol());
            usuario.setActivo(datosNuevos.getActivo());
            Usuario actualizado = usuarioService.save(usuario);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/restaurar/{id}")
    @Operation(summary = "Restaurar usuario", description = "Cambia el estado del usuario a activo (1) en tu base de datos.")
    public ResponseEntity<?> restaurar(@PathVariable Long id) {
        return usuarioService.findById(id).map(usuario -> {
            usuario.setActivo(true);
            Usuario actualizado = usuarioService.save(usuario);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por ID.")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        usuarioService.deleteById(id);
        return ResponseEntity.ok().build();
    }


    // PATCH lógico para desactivar usuario (activo = false)
    @PatchMapping("/eliminar/{id}")
    @Operation(summary = "Eliminar usuario (Lógico)", description = "Desactiva al usuario cambiando su campo 'activo' a false.")
    public ResponseEntity<?> eliminarLogico(@PathVariable Long id) {
        return usuarioService.findById(id).map(usuario -> {
            usuario.setActivo(false);
            Usuario actualizado = usuarioService.save(usuario);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

}