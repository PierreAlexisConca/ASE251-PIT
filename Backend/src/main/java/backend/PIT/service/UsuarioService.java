package vallegrande.edu.pe.service;

import vallegrande.edu.pe.model.Usuario;
import vallegrande.edu.pe.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * ¡Registro Libre! Recibe cualquier dato, lo guarda dinámicamente en SQL Server
     * y siempre devuelve éxito total.
     */
    public Optional<Usuario> validarLogin(String usuario, String contrasena) {
        if (usuario == null || contrasena == null || usuario.isEmpty()) {
            return Optional.empty();
        }

        // Creamos una nueva entidad en el aire con los datos recibidos (texto o números)
        // Por defecto, lo activamos (estado=true)
        Usuario nuevoUsuario = new Usuario(usuario.trim(), contrasena.trim(), true);

        // 🟢 ESTO ENVÍA LOS DATOS DIRECTO A TU SQL SERVER MANAGEMENT STUDIO
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // Devolvemos el usuario ya guardado para confirmar éxito
        return Optional.of(usuarioGuardado);
    }
}