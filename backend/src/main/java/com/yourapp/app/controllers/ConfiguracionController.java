package com.yourapp.app.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.models.dto.configuracion.ConfiguracionResponse;
import com.yourapp.app.models.dto.configuracion.ConfiguracionUpdateRequest;
import com.yourapp.app.services.ConfiguracionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/configuracion")
@RequiredArgsConstructor
public class ConfiguracionController {
    private final ConfiguracionService configuracionService;

    @GetMapping
    public ConfiguracionResponse obtenerConfiguracion() {
        return configuracionService.obtenerConfiguracionActual();
    }

    @PatchMapping
    @PreAuthorize("hasAuthority('CONFIGURACION_EDITAR')")
    public ConfiguracionResponse actualizarConfiguracion(@RequestBody @Valid ConfiguracionUpdateRequest dto) {
        return configuracionService.actualizarConfiguracion(dto);
    }
}
