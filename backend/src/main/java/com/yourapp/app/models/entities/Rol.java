package com.yourapp.app.models.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Rol extends Persistible {
    private String nombre;
    @ElementCollection(targetClass = Permiso.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private List<Permiso> permisos = new ArrayList<>();

    public boolean tenesPermiso(Permiso permiso) {
        return this.permisos.contains(permiso);
    }
}
