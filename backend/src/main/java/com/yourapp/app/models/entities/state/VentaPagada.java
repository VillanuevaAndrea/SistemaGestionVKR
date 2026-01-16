package com.yourapp.app.models.entities.state;

import com.yourapp.app.exceptions.BadRequestException;
import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.models.entities.ConfiguracionTienda;
import com.yourapp.app.models.entities.DetalleVenta;
import com.yourapp.app.models.entities.Venta;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("PAGADA")
@NoArgsConstructor
public class VentaPagada extends VentaState {

    @Override
    public void cancelar(String motivo) {
        Venta venta = getVenta();

        if (!puedeCancelarse()) throw new ConflictException("Solo se pueden cancelar ventas pagadas dentro del mismo mes");
        if (motivo == null || motivo.trim().isEmpty()) throw new BadRequestException("Motivo de cancelación requerido");

        venta.getDetalles().forEach(DetalleVenta::aumentarStock);

        System.out.println("Venta pagada cancelada. Motivo: " + motivo);
    }

    @Override
    public boolean puedeCambiarA(Class<? extends VentaState> nuevoEstado) {
        return nuevoEstado.equals(VentaCancelada.class) && puedeCancelarse();
    }

    private boolean puedeCancelarse() {
        Venta venta = getVenta();
        if (venta.getFecha() == null) {
            return false;
        }

        ConfiguracionTienda config = ConfiguracionTienda.getInstance();
        Integer diasPermitidos = config.getDiasMaximoCancelacion();

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaLimite = venta.getFecha().plusDays(diasPermitidos);

        return ahora.isBefore(fechaLimite);
    }
}
