package com.yourapp.app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.models.dto.subcategoria.SubcategoriaCreateRequest;
import com.yourapp.app.models.dto.subcategoria.SubcategoriaResponse;
import com.yourapp.app.services.SubcategoriaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/subcategorias")
@RequiredArgsConstructor
public class SubcategoriaController {
    private final SubcategoriaService subcategoriaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('SUBCATEGORIA_CREAR')")
    public SubcategoriaResponse crearSubcategoria(@RequestBody @Valid SubcategoriaCreateRequest subcategoriaDto) {
        return subcategoriaService.crearSubcategoria(subcategoriaDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('SUBCATEGORIA_ELIMINAR')")
    public void eliminarSubcategoria(@PathVariable Long id) {
        subcategoriaService.eliminarSubcategoria(id);
    }
}
