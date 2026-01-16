package com.yourapp.app.models.entities;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.models.entities.state.VentaState;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "ventas")
@Getter @Setter
@SQLRestriction("fue_eliminado = false")
public class Venta extends Persistible {

    @ManyToOne
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    private LocalDateTime fecha;

    private Double total = 0.0;

    @Column(name = "monto_pagado")
    private Double montoPagado = 0.0;

    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago;

    @Column(name = "fecha_vencimiento_reserva")
    private LocalDateTime fechaVencimientoReserva;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "estado_id")
    private VentaState estado;

    @Column(name = "estado_nombre")
    private String estadoNombre;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @SQLRestriction("fue_eliminado = false")
    private List<DetalleVenta> detalles = new ArrayList<>();

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @SQLRestriction("fue_eliminado = false")
    private List<PagoDeCredito> pagosCredito = new ArrayList<>();

    public enum MetodoPago {
        EFECTIVO, DEBITO, MERCADO_PAGO, CREDITO
    }

    @Override
    public void softDelete() {
        this.setFueEliminado(true);

        for (DetalleVenta detalle : detalles) {
            detalle.softDelete();
        }

        for (PagoDeCredito pago : pagosCredito) {
            pago.softDelete();
        }
    }

    public void setEstado(VentaState estado) {
        this.estado = estado;
        this.estadoNombre = estado != null ? estado.getClass().getSimpleName() : null;
    }

    public void agregarDetalle(DetalleVenta detalle) {
        detalle.setVenta(this);
        this.detalles.add(detalle);
        calcularTotal();
    }

    public void calcularTotal() {
        this.total = detalles.stream()
            .mapToDouble(DetalleVenta::getPrecioTotalUnitario)
            .sum();
    }

    public void reservarStockProductos() {
        for (DetalleVenta detalle : detalles) {
            detalle.reservarStock();
        }

        // Establecer fecha de vencimiento usando configuración
        ConfiguracionTienda config = ConfiguracionTienda.getInstance();
        Integer diasValidez = config.getDiasValidezReserva();
        this.fechaVencimientoReserva = LocalDateTime.now().plusDays(diasValidez);
    }

    public void liberarStockProductos() {
        for (DetalleVenta detalle : detalles) {
            detalle.liberarStockReservado();
        }
    }

    public void confirmarStockProductos() {
        for (DetalleVenta detalle : detalles) {
            detalle.confirmarVenta();
        }
    }

    public void confirmarStockReservado() {
        for (DetalleVenta detalle : detalles) {
            detalle.confirmarReserva();
        }
    }

    public void verificarStockDisponible() {
        for (DetalleVenta detalle : detalles) {
            if (!detalle.hayStockDisponible()) {
                throw new ConflictException("Stock insuficiente");
            }
        }
    }

    public void agregarPagoCredito(PagoDeCredito pago) {
        pago.setVenta(this);
        this.pagosCredito.add(pago);
    }

    public Double getSaldoPendiente() {
        return total - montoPagado;
    }

    public Double getProgresoPago() {
        if (total == 0) return 0.0;
        return Math.floor((montoPagado / total) * 100);
    }

    public Double getPagoMinimoParaCredito() {
        if (this.cliente == null) return 0.0;
        
        Double disponible = this.cliente.getCreditoDisponible();
        Double totalVenta = this.getTotal();
        
        if (totalVenta > disponible) {
            return totalVenta - disponible;
        }

        return 0.0;
    }

    public boolean estaCompletamentePagada() {
        return getSaldoPendiente() <= 0.01;
    }

    public boolean puedeCambiarA(Class<? extends VentaState> nuevoEstado) {
        return estado.puedeCambiarA(nuevoEstado);
    }
}