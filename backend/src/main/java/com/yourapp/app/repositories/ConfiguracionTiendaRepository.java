package com.yourapp.app.repositories;

import com.yourapp.app.models.entities.ConfiguracionTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfiguracionTiendaRepository extends JpaRepository<ConfiguracionTienda, Long> {

  Optional<ConfiguracionTienda> findFirstByOrderByIdAsc();
}