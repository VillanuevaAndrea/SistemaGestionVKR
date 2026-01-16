package com.yourapp.app.models.ValidadorContrasenia;

import lombok.Getter;
import lombok.Setter;

public class ValidarLongitudContrasenia extends OpcionValidacion {
    @Setter
    private static Integer LONGITUD_MINIMA = 8;
    @Getter
    private String mensajeExcepcion = "La contrasenia debe tener almenos"+ LONGITUD_MINIMA +"caracteres";

    @Override
    protected boolean contraseniaValida(String usuario, String contrasenia) {
        return contrasenia.length() >= LONGITUD_MINIMA;
    }
}
