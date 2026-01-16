package com.yourapp.app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yourapp.app.models.entities.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByDescripcionAndFueEliminadoFalse(String descripcion);

    List<Categoria> findByFueEliminadoFalse();
}
