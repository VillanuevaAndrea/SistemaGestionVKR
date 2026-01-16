package com.yourapp.app.models.entities.state;

import com.yourapp.app.models.entities.ConfiguracionTienda;
import com.yourapp.app.models.entities.Venta;
import com.yourapp.app.exceptions.BadRequestException;
import com.yourapp.app.exceptions.ForbiddenException;
import com.yourapp.app.models.entities.Cliente;
import com.yourapp.app.models.entities.PagoDeCredito;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("INICIADA")
@NoArgsConstructor
public class VentaIniciada extends VentaState {

    @Override
    public void cobrarTotal(Double monto, Venta.MetodoPago metodoPago) {
        Venta venta = getVenta();
        venta.verificarStockDisponible();
        venta.confirmarStockProductos();
        venta.setMontoPagado(venta.getMontoPagado() + monto);
        venta.setFecha(LocalDateTime.now());
    }

    @Override
    public void reservarConCredito(Double montoInicial) {
        Venta venta = getVenta();
        Cliente cliente = venta.getCliente();

        if (cliente == null) throw new BadRequestException("Se requiere cliente para reserva");
        if (!cliente.esConfiable()) throw new ForbiddenException("Cliente no es confiable");        

        ConfiguracionTienda config = ConfiguracionTienda.getInstance();

        // Validar si la tienda permite reservas
        if (config != null && !config.permiteReserva()) throw new ForbiddenException("La tienda no permite reservas en este momento");

        // Calcular mínimo usando configuración
        Double minimoInicial = venta.getTotal();
        
        if (config != null) minimoInicial = config.calcularMontoMinimoSena(venta.getTotal());
        
        if (montoInicial < minimoInicial) {
            throw new BadRequestException(
                String.format("Monto inicial mínimo: $%.2f (%.0f%% del total $%.2f)",
                    minimoInicial,
                    (config != null ? config.getPorcentajeMinimoSena() * 100 : 10),
                    venta.getTotal())
            );
        }

        if (montoInicial < minimoInicial) throw new BadRequestException("Monto inicial insuficiente");
        if (montoInicial > getSaldoPendiente()) throw new BadRequestException("Monto inicial excede el saldo pendiente");
        
        if (montoInicial > 0) {
            if (!cliente.puedeReservar(venta.getTotal() - (venta.getMontoPagado() + montoInicial))) {
                throw new ForbiddenException(
                    String.format("Crédito insuficiente: El saldo pendiente ($%.2f) supera su crédito disponible ($%.2f). [Límite: $%.2f, Deuda actual: $%.2f]",
                        venta.getTotal() - (venta.getMontoPagado() + montoInicial),
                        cliente.getCreditoDisponible(),
                        cliente.getCreditoLimite(),
                        cliente.getDeuda())
                );
            }

            PagoDeCredito pagoInicial = new PagoDeCredito();
            pagoInicial.setVenta(venta);
            pagoInicial.setCliente(cliente);
            pagoInicial.setMonto(montoInicial);
            pagoInicial.setNumeroPago(1);
            pagoInicial.setFecha(LocalDateTime.now());
            pagoInicial.setEsPagoInicial(true);
            pagoInicial.procesarPagoInicial();

            venta.agregarPagoCredito(pagoInicial);
        } else {
            cliente.aumentarDeuda(venta.getTotal() - venta.getMontoPagado());
        }

        venta.reservarStockProductos();
        Integer diasVencimiento = config != null ? config.getDiasMaximoCancelacion() : 90; 
        venta.setFechaVencimientoReserva(LocalDateTime.now().plusDays(diasVencimiento));
    }

    @Override
    public void rechazar(String motivo) {
        if (motivo == null || motivo.trim().isEmpty()) throw new BadRequestException("Motivo de rechazo requerido");
        
        System.out.println("Venta rechazada. Motivo: " + motivo);
    }

    @Override
    public boolean puedeCambiarA(Class<? extends VentaState> nuevoEstado) {
        return nuevoEstado.equals(VentaPagada.class) ||
            nuevoEstado.equals(VentaReservada.class) ||
            nuevoEstado.equals(VentaRechazada.class);
    }

    @Override
    public Double getSaldoPendiente() {
        Venta venta = getVenta();
        return venta.getTotal() - venta.getMontoPagado();
    }
}
