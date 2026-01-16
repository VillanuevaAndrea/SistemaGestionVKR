package com.yourapp.app.models.ValidadorContrasenia;

import lombok.Getter;

public class ValidarExistenciaLetraMinuscula extends OpcionValidacion {
    @Getter
    private final String mensajeExcepcion = "La contrasenia debe contener una letra minuscula";

    @Override
    protected boolean contraseniaValida(String usuario, String contrasenia) {
        return contrasenia.chars().anyMatch(caracter -> esLetraMinuscula((char)caracter));
    }

    protected boolean esLetraMinuscula(Character caracter) {
        return caracter>='a' && caracter<='z';
    }
}
