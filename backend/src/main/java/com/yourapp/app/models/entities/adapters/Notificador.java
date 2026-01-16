package com.yourapp.app.models.entities.adapters;

import com.yourapp.app.models.entities.Empleado;

public class Notificador {
    public void notificar(String mensaje, Empleado empleado) {
        empleado.recibirNotificacion(mensaje);
    }
}
