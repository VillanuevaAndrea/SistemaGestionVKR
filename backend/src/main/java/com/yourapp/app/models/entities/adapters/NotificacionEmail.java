package com.yourapp.app.models.entities.adapters;

import com.yourapp.app.models.entities.Empleado;

public class NotificacionEmail implements MedioDeNotificacion {
    private String contacto;
    private AdapterEmail adapterEmail;

    public void notificar(String mensaje, Empleado empleado) {

    }
}
