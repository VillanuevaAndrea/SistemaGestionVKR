package com.yourapp.app.models.entities.state;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.models.entities.Persistible;
import com.yourapp.app.models.entities.Venta;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Getter @Setter
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_estado", discriminatorType = DiscriminatorType.STRING)
@Table(name = "estados_venta")
@NoArgsConstructor
public abstract class VentaState extends Persistible {

    @ManyToOne
    @JoinColumn(name = "venta_id")
    @JsonIgnore
    private Venta venta;


    public void cobrarTotal(Double monto, Venta.MetodoPago metodoPago) {
        throwUnsupportedError();
    }

    public void fiar(Double monto) {
        throwUnsupportedError();
    }

    public void reservarConSenia(Double senia) {
        throwUnsupportedError();
    }

    public void reservarConCredito(Double montoInicial) {
        throwUnsupportedError();
    }

    public void agregarPagoCredito(Double monto) {
        throwUnsupportedError();
    }

    public void cancelar(String motivo) {
        throwUnsupportedError();
    }

    public Venta procesarCambioProducto(Venta nuevaVenta, Double montoPagadoOriginal, Double totalNuevo) {
        throwUnsupportedError();
        return null;
    }

    public void rechazar(String motivo) {
        throwUnsupportedError();
    }

    public boolean puedeCambiarA(Class<? extends VentaState> nuevoEstado) {
        return false;
    }

    public Double getSaldoPendiente() {
        return 0.0;
    }

    private void throwUnsupportedError() {
        throw new ConflictException("Operación no permitida en estado: " + this.getClass().getSimpleName());
    }
}