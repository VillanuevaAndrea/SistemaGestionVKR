package com.yourapp.app.models.entities.state;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("CANCELADA")
@NoArgsConstructor
public class VentaCancelada extends VentaState {

    @Override
    public boolean puedeCambiarA(Class<? extends VentaState> nuevoEstado) {
        return false;
    }
}
