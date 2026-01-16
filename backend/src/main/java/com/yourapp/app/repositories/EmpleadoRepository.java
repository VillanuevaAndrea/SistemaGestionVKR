package com.yourapp.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.yourapp.app.models.entities.Empleado;
import com.yourapp.app.models.entities.Usuario;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long>, JpaSpecificationExecutor<Empleado> {
    boolean existsByUsuario(Usuario usuario);

    boolean existsByDniAndFueEliminadoFalse(String dni);
}
