package com.yourapp.app.models.ValidadorContrasenia;


import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.yourapp.app.exception.ContraseniaInvalidaExcepcion;
import com.yourapp.app.models.entities.Usuario;

@Setter @Getter
public class ValidadorContrasenia {
    private List<OpcionValidacion> opcionesDeValidacion;
    private Integer tiempoPenalizacion = 60;

    public ValidadorContrasenia() {
        this.opcionesDeValidacion = new ArrayList<>();
    }

    public void agregarOpcionesValidacion(OpcionValidacion ... opcionesDeValidacion) {
        Collections.addAll(this.opcionesDeValidacion, opcionesDeValidacion);
    }

    // public Boolean validarContrasenia(Usuario usuario) {
    //     if(!usuario.estaPenalizado()) {
    //         try {
    //             opcionesDeValidacion.stream().
    //                     forEach(opcion -> opcion.validarContrasenia(usuario.getNombre(), usuario.getContrasenia()));
    //         } catch (ContraseniaInvalidaExcepcion ex) {
    //             usuario.penalizar(tiempoPenalizacion);
    //             return false;
    //         }
    //         return true;
    //     }
    //     return false;
    // }
}
