package com.yourapp.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.yourapp.app.models.entities.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {
    Boolean existsBySubcategoriaIdAndFueEliminadoFalse(Long id);

    Boolean existsBySubcategoriaCategoriaIdAndFueEliminadoFalse(Long categoriaId);
}
