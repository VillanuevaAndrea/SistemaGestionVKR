package com.yourapp.app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.models.dto.usuario.UsuarioResponse;
import com.yourapp.app.models.dto.usuario.UsuarioUpdateRequest;
import com.yourapp.app.services.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/usuarios") 
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('USUARIO_MODIFICAR')")
    public UsuarioResponse actualizarRolUsuario(@PathVariable Long id, @RequestBody @Valid UsuarioUpdateRequest usuarioDto ) {
        return usuarioService.actualizarRolUsuario(id, usuarioDto);
    }
}
