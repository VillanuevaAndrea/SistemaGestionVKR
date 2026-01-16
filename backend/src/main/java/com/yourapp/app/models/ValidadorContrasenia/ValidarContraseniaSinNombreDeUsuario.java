package com.yourapp.app.models.ValidadorContrasenia;

import lombok.Getter;

public class ValidarContraseniaSinNombreDeUsuario extends OpcionValidacion {
    @Getter
    private final String mensajeExcepcion = "La contrasenia no debe contener el nombre del usuario";

    @Override
    protected boolean contraseniaValida(String usuario, String contrasenia) {
        return !contrasenia.toLowerCase().contains(usuario.toLowerCase());
    }
}
