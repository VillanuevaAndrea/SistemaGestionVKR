package com.yourapp.app.models.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto extends Persistible {
    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "subcategoria_id")
    private Subcategoria subcategoria;

    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleProducto> detallesProductos = new ArrayList<>();

    @Column(nullable = false)
    private Integer precio;

    public int getStockTotal() {
        return detallesProductos.stream()
            .mapToInt(DetalleProducto::getStockActual)
            .sum();
    }

    @Override
    public void softDelete() {
        this.setFueEliminado(true);

        for (DetalleProducto detalle : detallesProductos) {
            detalle.softDelete();
        }
    }
}
