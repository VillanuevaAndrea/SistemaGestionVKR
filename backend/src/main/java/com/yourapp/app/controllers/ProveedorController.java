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

import com.yourapp.app.models.dto.proveedor.ProveedorCreateRequest;
import com.yourapp.app.models.dto.proveedor.ProveedorResponse;
import com.yourapp.app.services.ProveedorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/proveedores")
@RequiredArgsConstructor
public class ProveedorController {
    private final ProveedorService proveedorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PROVEEDOR_CREAR')")
    public ProveedorResponse crearProveedor(@RequestBody @Valid ProveedorCreateRequest proveedorDto) {
        return proveedorService.crearProveedor(proveedorDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROL_ELIMINAR')")
    public void eliminarProveedor(@PathVariable Long id) {
        proveedorService.eliminarProveedor(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProveedorResponse> obtenerTodosLosProveedores() {
        return proveedorService.obtenerTodosLosProveedores();
    } 
}
