package com.yourapp.app.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.models.dto.color.ColorCreateRequest;
import com.yourapp.app.models.dto.color.ColorResponse;
import com.yourapp.app.services.ColorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/colores")
@RequiredArgsConstructor
public class ColorController {
    private final ColorService colorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('COLOR_CREAR')")
    public ColorResponse crearColor(@RequestBody @Valid ColorCreateRequest colorDto) {
        return colorService.crearColor(colorDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('COLOR_ELIMINAR')")
    public void eliminarColor(@PathVariable Long id) {
        colorService.eliminarColor(id);
    }    

    @GetMapping
    @ResponseStatus(HttpStatus.OK) 
    public List<ColorResponse> obtenerTodosLosColores() {
        return colorService.obtenerTodosLosColores();
    }
}
