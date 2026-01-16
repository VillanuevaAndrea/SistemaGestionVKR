package com.yourapp.app.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.mappers.UsuarioMapper;
import com.yourapp.app.models.dto.TokenResponse;
import com.yourapp.app.models.dto.usuario.ContraseniaRecuperarRequest;
import com.yourapp.app.models.dto.usuario.ContraseniaResetearRequest;
import com.yourapp.app.models.dto.usuario.ContraseniaUpdateRequest;
import com.yourapp.app.models.dto.usuario.UsuarioLoginRequest;
import com.yourapp.app.models.dto.usuario.UsuarioMeResponse;
import com.yourapp.app.models.entities.Usuario;
import com.yourapp.app.services.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UsuarioMapper usuarioMapper;

    @PostMapping("/login")
    public TokenResponse login(@RequestBody @Valid UsuarioLoginRequest usuarioDto) {
        return authService.login(usuarioDto);
    }

    @PostMapping("/cambiar-contrasenia")
    @PreAuthorize("isAuthenticated()")
    public TokenResponse cambiarContrasenia(@RequestBody @Valid ContraseniaUpdateRequest usuarioDto) {
        return authService.cambiarContrasenia(usuarioDto);
    }

    @PostMapping("/recuperar-contrasenia")
    public void recuperarContrasenia(@RequestBody @Valid ContraseniaRecuperarRequest usuarioDto) {
        authService.recuperarContrasenia(usuarioDto);
    }

    @PostMapping("/resetear-contrasenia") 
    public void resetearContrasenia(@RequestBody @Valid ContraseniaResetearRequest usuarioDto) {
        authService.resetearContrasenia(usuarioDto);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UsuarioMeResponse me() {
        Usuario usuarioLogueado = authService.obtenerUsuarioLogueado();
        return usuarioMapper.toMeResponse(usuarioLogueado);
    } 
}
