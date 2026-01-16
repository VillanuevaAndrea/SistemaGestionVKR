package com.yourapp.app.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.mappers.PermisoMapper;
import com.yourapp.app.models.dto.rol.PermisoResponse;
import com.yourapp.app.models.entities.Permiso;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/permisos")
@RequiredArgsConstructor
public class PermisoController {
    private final PermisoMapper permisoMapper;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PERMISO_VER')")
    public List<PermisoResponse> obtenerPermisos() {
        return Arrays
            .stream(Permiso.values())
            .map(permisoMapper::toResponse)
            .collect(Collectors.toList());
    }
}
