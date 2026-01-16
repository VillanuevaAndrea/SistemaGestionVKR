package com.yourapp.app.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Subcategoria extends Persistible {
    private String descripcion;

    @ManyToOne
    private Categoria categoria;
}
