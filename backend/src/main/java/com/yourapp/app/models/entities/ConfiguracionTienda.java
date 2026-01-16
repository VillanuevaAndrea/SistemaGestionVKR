package com.yourapp.app.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "configuracion_tienda")
public class ConfiguracionTienda extends Persistible {

  @Column(name = "nombre_empresa")
  private String nombreEmpresa = "Mi Tienda";
  
  @Column(name = "eslogan")
  private String eslogan;

  @Column(name = "permite_reserva")
  private Boolean permiteReserva = true;

  @Column(name = "porcentaje_minimo_sena")
  private Double porcentajeMinimoSena = 0.10; // 10%

  @Column(name = "dias_validez_reserva")
  private Integer diasValidezReserva = 90; // 3 meses

  @Column(name = "stock_minimo_global")
  private Integer stockMinimoGlobal = 5;

  @Column(name = "dias_maximo_cancelacion")
  private Integer diasMaximoCancelacion = 60; // 2 meses

  // Patrón Singleton a nivel de aplicación (cache)
  @Transient
  private static ConfiguracionTienda instancia;

  public static ConfiguracionTienda getInstance() {
    return instancia;
  }

  public static void setInstance(ConfiguracionTienda configuracion) {
    instancia = configuracion;
  }

  // Métodos de negocio
  public Double calcularMontoMinimoSena(Double totalVenta) {
    return totalVenta * porcentajeMinimoSena;
  }

  public boolean permiteReserva() {
    return Boolean.TRUE.equals(permiteReserva);
  }
}