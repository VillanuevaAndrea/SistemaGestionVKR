package com.yourapp.app.models.ValidadorContrasenia;

import lombok.Getter;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


public class ValidarTopContraseniasDebiles extends OpcionValidacion {
    private List<String> contraseniasDebiles;
    @Getter
    private String mensajeExcepcion = "La contrasenia esta en el Top 10000 peores contrasenias";


    public ValidarTopContraseniasDebiles() {
        this.contraseniasDebiles = this.obtenerContraseniasDebiles();
    }


    @Override
    protected boolean contraseniaValida(String usuario, String contrasenia) {
        return !contraseniasDebiles.stream().
                anyMatch(contraseniaDebil -> contraseniaDebil.equals(contrasenia));
    }

    public List<String> obtenerContraseniasDebiles() {
        InputStream streamContraseniasDebiles = this.getClass().getClassLoader().
                getResourceAsStream("TopPeoresContrasenias.txt");
        Objects.requireNonNull(streamContraseniasDebiles);
        InputStreamReader streamReaderContraseniasDebiles = new InputStreamReader(streamContraseniasDebiles, StandardCharsets.UTF_8);

        return new BufferedReader(streamReaderContraseniasDebiles).lines().collect(Collectors.toList());
    }
}
