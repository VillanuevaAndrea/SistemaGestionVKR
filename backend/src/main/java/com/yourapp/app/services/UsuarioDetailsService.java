package com.yourapp.app.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.yourapp.app.models.entities.Usuario;
import com.yourapp.app.models.entities.UsuarioDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioDetailsService implements UserDetailsService {
    private final UsuarioService usuarioService;

    @Override
    public UserDetails loadUserByUsername(String username) {
        Usuario usuario = usuarioService.obtenerUsuarioByNombre(username);
        return new UsuarioDetails(usuario);
    }
}
