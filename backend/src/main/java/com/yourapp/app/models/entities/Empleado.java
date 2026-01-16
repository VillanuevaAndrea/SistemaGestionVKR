package com.yourapp.app.models.entities;

import java.util.ArrayList;
import java.util.List;

import com.yourapp.app.models.entities.adapters.MedioDeNotificacion;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Empleado extends Persistible {
    private String nombre;

    private String apellido;

    private String dni;

    private String direccion;

    private String mail;

    private String telefono;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Transient
    private List<MedioDeNotificacion> mediosDeNotificacion = new ArrayList<>();

    public void recibirNotificacion(String mensaje) {
        this.mediosDeNotificacion.forEach(m -> m.notificar(mensaje, this));
    }

    @Override
    public void softDelete() {
        this.setFueEliminado(true);
        this.usuario.softDelete();;
    }
}
