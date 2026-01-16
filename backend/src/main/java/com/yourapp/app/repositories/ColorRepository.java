package com.yourapp.app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yourapp.app.models.entities.Color;

public interface ColorRepository extends JpaRepository<Color, Long> {
    boolean existsByDescripcionAndFueEliminadoFalse(String descripcion);  
    
    List<Color> findByFueEliminadoFalse();
}
