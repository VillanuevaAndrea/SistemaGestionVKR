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

import com.yourapp.app.models.dto.categoria.CategoriaCreateRequest;
import com.yourapp.app.models.dto.categoria.CategoriaResponse;
import com.yourapp.app.services.CategoriaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {
    private final CategoriaService categoriaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CATEGORIA_CREAR')")
    public CategoriaResponse crearCategoria(@RequestBody @Valid CategoriaCreateRequest categoriaDto) {
        return categoriaService.crearCategoria(categoriaDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('CATEGORIA_ELIMINAR')")
    public void eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK) 
    public List<CategoriaResponse> obtenerTodasLasCategorias() {
        return categoriaService.obtenerTodasLasCategorias();
    }
}
