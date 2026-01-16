package com.yourapp.app.models.entities.adapters;

import com.yourapp.app.models.entities.Empleado;

public interface MedioDeNotificacion {
    public void notificar(String mensaje, Empleado Empleado);
}
