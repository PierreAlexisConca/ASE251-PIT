package backend.PIT.repository;

import backend.PIT.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	Optional<Usuario> findByUsernameAndPasswordAndActivoTrue(String username, String password);
	Optional<Usuario> findByUsername(String username);
}
