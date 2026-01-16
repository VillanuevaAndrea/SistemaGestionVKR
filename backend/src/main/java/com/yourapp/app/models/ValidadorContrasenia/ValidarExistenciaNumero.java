package com.yourapp.app.models.ValidadorContrasenia;

import lombok.Getter;

public class ValidarExistenciaNumero extends OpcionValidacion {
    @Getter
    private final String mensajeExcepcion = "La contrasenia debe contener un numero";

    @Override
    protected boolean contraseniaValida(String usuario, String contrasenia) {
        return contrasenia.chars().anyMatch(caracter -> esNumero((char)caracter));
    }

    protected boolean esNumero(Character caracter) {
        return caracter>='0' && caracter<='9';
    }
}
