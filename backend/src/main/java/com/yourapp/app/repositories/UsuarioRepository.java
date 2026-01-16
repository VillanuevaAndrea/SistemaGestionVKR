package com.yourapp.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.yourapp.app.models.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {
    boolean existsByNombreDeUsuarioAndFueEliminadoFalse(String nombreDeUsuario);

    Usuario findByNombreDeUsuario(String nombreDeUsuario);

    Usuario findByEmpleadoMail(String mail);

    Usuario findByResetToken(String resetToken);
}
