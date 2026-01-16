package com.yourapp.app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yourapp.app.models.entities.Rol;

public interface RolRepository extends JpaRepository<Rol, Long> {
    boolean existsByNombreAndFueEliminadoFalse(String nombre);

    List<Rol> findByFueEliminadoFalse();
}
