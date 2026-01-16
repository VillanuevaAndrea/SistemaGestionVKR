package com.yourapp.app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yourapp.app.models.entities.Proveedor;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    boolean existsByNombreAndFueEliminadoFalse(String nombre);

    List<Proveedor> findByFueEliminadoFalse();
}
