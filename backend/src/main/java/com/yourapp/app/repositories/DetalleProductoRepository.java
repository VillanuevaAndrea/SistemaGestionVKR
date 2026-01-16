package com.yourapp.app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourapp.app.models.entities.DetalleProducto;

public interface DetalleProductoRepository extends JpaRepository<DetalleProducto, Long> {
    Optional<DetalleProducto> findByCodigo(String codigo);

    Boolean existsByCodigoAndFueEliminadoFalse(String codigo);
}
