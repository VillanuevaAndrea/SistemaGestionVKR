package com.yourapp.app.models.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Categoria extends Persistible {
    private String descripcion;

    private Boolean estaActiva = true;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subcategoria> subcategorias = new ArrayList<>();

    @Override
    public void softDelete() {
        this.setFueEliminado(true);

        for (Subcategoria sub : subcategorias) {
            sub.softDelete();
        }
    }
}
