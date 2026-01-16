package com.yourapp.app.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.yourapp.app.exceptions.UnauthorizedException;
import com.yourapp.app.services.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // =====================================================
        // RUTAS PÚBLICAS
        // Estas rutas NO requieren autenticación ni JWT
        // Se usan para login y recuperación de contraseña
        // =====================================================
        String uri = request.getRequestURI();

        if (
            uri.equals("/auth/login") 
            || uri.equals("/auth/recuperar-contrasenia") 
            || uri.equals("/auth/resetear-contrasenia")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // VALIDACIÓN DEL HEADER AUTHORIZATION
        // A partir de acá, TODAS las rutas requieren un JWT válido
        // =====================================================
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) throw new UnauthorizedException("Se requiere token de autenticación."); 
        
        try {
            String token = authHeader.substring(7);

            // =====================================================
            // REGLA DE PRIMER LOGIN
            // Si el usuario tiene una contraseña inicial, solo puede acceder a endpoints relacionados al cambio o recuperación de contraseña
            // =====================================================
            Boolean primerLogin = jwtService.extractPrimerLogin(token);
        
            if (
                Boolean.TRUE.equals(primerLogin) 
                && !request.getRequestURI().equals("/auth/cambiar-contrasenia")
                && !request.getRequestURI().equals("/auth/recuperar-contrasenia")
                && !request.getRequestURI().equals("/auth/resetear-contrasenia")
            ) {
                throw new UnauthorizedException("Debe cambiar su contraseña inicial antes de acceder a otros recursos.");
            }

            // =====================================================
            // AUTENTICACIÓN EN SPRING SECURITY
            // Se extrae el username del token y se carga el usuario desde la base solo si aún no está autenticado
            // =====================================================
            String username = jwtService.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // Validación final del token contra el usuario
                if (!jwtService.isTokenValid(token, userDetails)) throw new UnauthorizedException("Token de autenticación inválido o expirado."); 
                
                // Se registra la autenticación en el contexto de seguridad
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            
            filterChain.doFilter(request, response);
        } catch (UnauthorizedException ex) {
            // Se propaga la excepción para que la maneje el ExceptionHandlerFilter
            throw ex; 
        } catch (Exception ex) {
            // Cualquier otro error se trata como token inválido
            throw new UnauthorizedException("Token de autenticación inválido o corrupto.");
        }
    }
}