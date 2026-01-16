package com.yourapp.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yourapp.app.models.dto.venta.VentaDiariaResponse;
import com.yourapp.app.models.entities.Venta;
import com.yourapp.app.models.entities.state.VentaState;

import java.time.LocalDateTime;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long>, JpaSpecificationExecutor<Venta> {

  @Query("SELECT v FROM Venta v WHERE TYPE(v.estado) = :estadoClass")
  List<Venta> findByEstado(@Param("estadoClass") Class<? extends VentaState> estadoClass);

  @Query("SELECT SUM(v.total) FROM Venta v WHERE v.estadoNombre = :estado AND v.fecha >= :fechaInicio")
  Double sumarTotalVentasDesde(@Param("estado") String estado, @Param("fechaInicio") LocalDateTime fechaInicio);

  long countByEstadoNombre(String estadoNombre);

@Query("SELECT new com.yourapp.app.models.dto.venta.VentaDiariaResponse(" +
       "CAST(CAST(v.fecha AS date) AS string), " + 
       "SUM(v.total)) " +
       "FROM Venta v " +
       "WHERE v.fecha >= :fechaInicio AND v.estadoNombre = 'VentaPagada' " +
       "GROUP BY CAST(v.fecha AS date) " + 
       "ORDER BY CAST(v.fecha AS date) ASC")
  List<VentaDiariaResponse> obtenerVentasMensuales(@Param("fechaInicio") LocalDateTime fechaInicio);
}
