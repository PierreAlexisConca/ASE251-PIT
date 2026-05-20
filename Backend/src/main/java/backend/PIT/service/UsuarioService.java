
    package backend.PIT.service;

import backend.PIT.model.Usuario;
import backend.PIT.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    public java.util.List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Valida usuario y contraseña. Devuelve el usuario si existe y está activo.
     */
    public Optional<Usuario> validarLogin(String username, String password) {
        if (username == null || password == null || username.isEmpty()) {
            return Optional.empty();
        }
        return usuarioRepository.findByUsernameAndPasswordAndActivoTrue(username.trim(), password.trim());
    }

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }
}