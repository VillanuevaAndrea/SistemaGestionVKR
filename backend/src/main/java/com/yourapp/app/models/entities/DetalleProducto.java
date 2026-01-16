package com.yourapp.app.models.entities;

import com.yourapp.app.exceptions.BadRequestException;
import com.yourapp.app.exceptions.ConflictException;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class DetalleProducto extends Persistible {
    @ManyToOne
    private Producto producto;

    @Column(nullable = false)
    private String codigo;

    @ManyToOne
    private Talle talle;

    @ManyToOne
    private Color color;

    @Column(nullable = false)
    private Integer stockActual = 0;

    @Column(nullable = false)
    private Integer stockReservado = 0;
    
    @Column(nullable = false)
    private Integer stockMinimo = 0;

    public DetalleProducto() {
        // Establecer stock mínimo por defecto según configuración
        ConfiguracionTienda config = ConfiguracionTienda.getInstance();
        this.stockMinimo = (config != null) ? config.getStockMinimoGlobal() : 5;
    }

    public void setStockMinimo(Integer stockMinimo) {
        if (stockMinimo != null && stockMinimo > 0) this.stockMinimo = stockMinimo;
    }

    // Métodos de negocio para manejo de stock
    public Integer getStockDisponible() {
        return Math.max(0, stockActual - stockReservado);
    }

    public void reservarStock(Integer cantidad) {
        if (cantidad <= 0) throw new BadRequestException("Cantidad debe ser positiva");

        if (cantidad > getStockDisponible()) {
            throw new ConflictException(
                String.format("Stock disponible insuficiente. Disponible: %d, Solicitado: %d", getStockDisponible(), cantidad)
            );
        }
        
        this.stockReservado += cantidad;
    }

    public void liberarStockReservado(Integer cantidad) {
        if (cantidad <= 0) throw new BadRequestException("Cantidad debe ser positiva");
        
        if (cantidad > stockReservado) throw new ConflictException(String.format("No hay suficiente stock reservado. Reservado: %d, A liberar: %d", stockReservado, cantidad));
        
        this.stockReservado -= cantidad;
    }

    public void confirmarReserva(Integer cantidad) {
        if (cantidad <= 0) throw new BadRequestException("Cantidad debe ser positiva");
        
        if (cantidad > stockReservado) throw new ConflictException("Cantidad no reservada previamente");
        
        if (cantidad > stockActual) throw new ConflictException("Stock actual insuficiente");
        
        // Liberar de reservado y disminuir actual
        this.stockReservado -= cantidad;
        this.stockActual -= cantidad;
    }

    public void confirmarVenta(Integer cantidad) {
        if (cantidad <= 0) throw new BadRequestException("Cantidad debe ser positiva");

        if (cantidad > stockActual) throw new ConflictException("Stock actual insuficiente");

        this.stockActual -= cantidad;
    }

    public void cancelarVenta(Integer cantidad) {
        liberarStockReservado(cantidad);
    }

    public void aumentarStock(Integer cantidad) {
        if (cantidad <= 0) throw new BadRequestException("Cantidad debe ser positiva");

        this.stockActual += cantidad;
    }

    public boolean necesitaReposicion() {
        ConfiguracionTienda config = ConfiguracionTienda.getInstance();
        Integer minimo = (config != null) ? config.getStockMinimoGlobal() : this.stockMinimo;
        return stockActual <= minimo;
    }

    public boolean necesitaReposicionPorUnidad() {
        return stockActual == 0;
    }

    public boolean necesitaReposicionPorCurva() {
        return stockActual < 2;
    }
}
