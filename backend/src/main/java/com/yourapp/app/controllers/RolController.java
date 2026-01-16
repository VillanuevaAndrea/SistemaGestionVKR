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

import com.yourapp.app.models.dto.rol.RolCreateRequest;
import com.yourapp.app.models.dto.rol.RolResponse;
import com.yourapp.app.models.dto.rol.RolUpdateRequest;
import com.yourapp.app.services.RolService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RolController {
    private final RolService rolService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROL_CREAR')")
    public RolResponse crearRol(@RequestBody @Valid RolCreateRequest rolDto) {
        return rolService.crearRol(rolDto);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROL_ACTUALIZAR')")
    public RolResponse actualizarPermisos(@PathVariable Long id, @RequestBody @Valid RolUpdateRequest rolDto) {
        return rolService.actualizarPermisos(id, rolDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROL_ELIMINAR')")
    public void eliminarRol(@PathVariable Long id) {
        rolService.eliminarRol(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('ROL_VER')")
    public List<RolResponse> obtenerTodosLosRoles() {
        return rolService.obtenerTodosLosRoles();
    }
}
