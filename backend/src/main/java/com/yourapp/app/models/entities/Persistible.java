package com.yourapp.app.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
public abstract class Persistible {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @CreationTimestamp
  @Column(name = "fecha_creacion", updatable = false)
  private LocalDateTime fechaCreacion;

  @UpdateTimestamp
  @Column(name = "fecha_modificacion")
  private LocalDateTime fechaModificacion;

  @Column(name = "fue_eliminado")
  private Boolean fueEliminado = false;

  @PrePersist
  protected void onCreate() {
    if (fueEliminado == null) {
      fueEliminado = false;
    }
  }

  public void softDelete() {
    this.fueEliminado = true;
  }

  public void restore() {
    this.fueEliminado = false;
  }
}