package com.yourapp.app.models.ValidadorContrasenia;

import lombok.Getter;

public class ValidarExistenciaLetraMayuscula extends OpcionValidacion {
    @Getter
    private final String mensajeExcepcion = "La contrasenia debe contener una letra mayuscula";

    @Override
    protected boolean contraseniaValida(String usuario, String contrasenia) {
        return contrasenia.chars().anyMatch(caracter -> esLetraMayuscula((char)caracter));
    }

    protected boolean esLetraMayuscula(Character caracter) {
        return caracter>='A' && caracter<='Z';
    }
}
