package com.yourapp.app.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.exceptions.UnauthorizedException;
import com.yourapp.app.models.dto.TokenResponse;
import com.yourapp.app.models.dto.usuario.ContraseniaRecuperarRequest;
import com.yourapp.app.models.dto.usuario.ContraseniaResetearRequest;
import com.yourapp.app.models.dto.usuario.ContraseniaUpdateRequest;
import com.yourapp.app.models.dto.usuario.UsuarioLoginRequest;
import com.yourapp.app.models.entities.Usuario;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // ============================ LOGIN ============================
    public TokenResponse login(UsuarioLoginRequest usuarioDto) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(usuarioDto.getNombreDeUsuario(), usuarioDto.getContrasenia()));
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Usuario o contraseña incorrectos");
        }

        Usuario usuario = usuarioService.obtenerUsuarioByNombre(usuarioDto.getNombreDeUsuario());

        String jwtToken = jwtService.generateToken(usuario);

        return new TokenResponse(jwtToken);
    }

    // ============================ CAMBIAR CONTRASEÑA (CON CONTRASEÑA ANTERIOR) ============================
    public TokenResponse cambiarContrasenia(ContraseniaUpdateRequest usuarioDto) {
        Usuario usuario = obtenerUsuarioLogueado();

        Usuario usuarioActualizado = usuarioService.actualizarContraseniaUsuario(usuario, usuarioDto);

        String jwtToken = jwtService.generateToken(usuarioActualizado);

        return new TokenResponse(jwtToken);
    }

    // ============================ PEDIR RECUPERACION DE CONTRASEÑA ============================
    public void recuperarContrasenia(ContraseniaRecuperarRequest usuarioDto) {
        try {
            Usuario usuario = usuarioService.obtenerUsuarioByMail(usuarioDto.getMail());
            String token = UUID.randomUUID().toString();
            usuarioService.recuperarContrasenia(usuario, token);
        } catch (NotFoundException e) {}
    }

    // ============================ CAMBIAR CONTRASEÑA (CON TOKEN) ============================
    public void resetearContrasenia(ContraseniaResetearRequest usuarioDto) {
        Usuario usuario = usuarioService.obtenerUsuarioByToken(usuarioDto.getToken());

        if (usuario.getResetTokenExpiracion() == null || usuario.getResetTokenExpiracion().isBefore(LocalDateTime.now())) throw new ConflictException("Token inválido o expirado");

        usuarioService.resetearContrasenia(usuario, usuarioDto.getContraseniaNueva());
    }

    // ============================ OBTENER EL USUARIO DE LA SESION ============================
    public Usuario obtenerUsuarioLogueado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) throw new UnauthorizedException("Usuario no autenticado");

        return usuarioService.obtenerUsuarioByNombre(auth.getName());
    }
}
