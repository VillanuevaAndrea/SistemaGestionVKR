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

import com.yourapp.app.models.dto.talle.TalleCreateRequest;
import com.yourapp.app.models.dto.talle.TalleResponse;
import com.yourapp.app.services.TalleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/talles")
@RequiredArgsConstructor
public class TalleController {
    private final TalleService talleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('TALLE_CREAR')")
    public TalleResponse crearTalle(@RequestBody @Valid TalleCreateRequest talleDto) {
        return talleService.crearTalle(talleDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('TALLE_ELIMINAR')")
    public void eliminarTalle(@PathVariable Long id) {
        talleService.eliminarTalle(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK) 
    public List<TalleResponse> obtenerTodosLosTalles() {
        return talleService.obtenerTodosLosTalles();
    }
}
