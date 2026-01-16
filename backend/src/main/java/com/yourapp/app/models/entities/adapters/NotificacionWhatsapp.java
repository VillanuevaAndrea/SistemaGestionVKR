package com.yourapp.app.models.entities.adapters;

import com.yourapp.app.models.entities.Empleado;

public class NotificacionWhatsapp implements MedioDeNotificacion {
    private AdapterWhatsapp adapterWhatsapp;

    public NotificacionWhatsapp(AdapterWhatsapp adapter) {
        this.adapterWhatsapp = adapter;
    }
    
    @Override
    public void notificar(String mensaje, Empleado empleado) {
        adapterWhatsapp.notificar(mensaje, empleado.getTelefono());
    }
}
