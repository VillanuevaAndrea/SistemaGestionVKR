package com.yourapp.app.models.entities;

import com.yourapp.app.exceptions.BadRequestException;
import com.yourapp.app.exceptions.ConflictException;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
public class Cliente extends Persistible {

    @Column(nullable = false)
    private String nombre;

    private String apellido;

    private String telefono;

    private String dni;

    @Column(name = "credito_limite")
    private Double creditoLimite = 0.0;

    private Double deuda = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_cliente")
    private CategoriaCliente categoriaCliente;

    public enum CategoriaCliente {
        REGISTRADO, CONFIABLE, NO_CONFIABLE
    }

    public boolean puedeReservar(Double monto) {
        if (categoriaCliente != CategoriaCliente.CONFIABLE) {
            return false;
        }
        return monto <= getCreditoDisponible();
    }

    public Double getCreditoDisponible() {
        return creditoLimite - deuda;
    }

    public void aumentarDeuda(Double monto) {
        if (monto <= 0) throw new BadRequestException("Monto debe ser positivo");
        
        if (deuda + monto > creditoLimite) throw new ConflictException("Supera límite de crédito");
        
        this.deuda += monto;
    }

    public void disminuirDeuda(Double monto) {
        if (monto <= 0) throw new BadRequestException("Monto debe ser positivo");
        
        this.deuda -= monto;
    }

    public boolean esConfiable() {
        return categoriaCliente == CategoriaCliente.CONFIABLE;
    }
}