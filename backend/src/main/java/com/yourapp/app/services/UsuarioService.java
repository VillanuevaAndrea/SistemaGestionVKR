package com.yourapp.app.services;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.exceptions.UnauthorizedException;
import com.yourapp.app.mappers.UsuarioMapper;
import com.yourapp.app.models.dto.empleado.EmpleadoCreateRequest;
import com.yourapp.app.models.dto.usuario.ContraseniaUpdateRequest;
import com.yourapp.app.models.dto.usuario.UsuarioResponse;
import com.yourapp.app.models.dto.usuario.UsuarioUpdateRequest;
import com.yourapp.app.models.entities.Usuario;
import com.yourapp.app.models.entities.Rol;
import com.yourapp.app.repositories.UsuarioRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final RolService rolService;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    // ============================ CREAR UN USUARIO ============================
    @Transactional
    public Usuario crearUsuario(EmpleadoCreateRequest empleadoDto) {
        Rol rol = rolService.obtenerEntidad(empleadoDto.getRolId());

        String nombreDeUsuario = generarNombreDeUsuario(empleadoDto.getNombre(), empleadoDto.getApellido()).toLowerCase();

        Usuario usuario = new Usuario();
        usuario.setNombreDeUsuario(nombreDeUsuario);
        usuario.setRol(rol);
        usuario.setContrasenia(passwordEncoder.encode(empleadoDto.getDni()));
        
        return usuarioRepository.save(usuario);
    }

    // --------- Generacion del nombre de usuario ----------
    public String generarNombreDeUsuario(String nombre, String apellido) {
        String nombreLimpio = nombre.trim().toLowerCase();
        String apellidoLimpio = apellido.trim().toLowerCase().replaceAll("\\s+", "");
        
        for (int i = 1; i <= nombreLimpio.length(); i++) {
            String parteNombre = nombreLimpio.substring(0, i);
            String nombreTentativo = parteNombre + apellidoLimpio;

            if (!existeUsuarioByNombre(nombreTentativo)) return nombreTentativo;
        }
        
        int sufijo = 1;
        String base = nombreLimpio + apellidoLimpio;
        String nombreTentativo;
        
        do {
            nombreTentativo = base + sufijo;
            if (!existeUsuarioByNombre(nombreTentativo)) return nombreTentativo;
            sufijo++;
        } while (sufijo < 100);

        throw new ConflictException("No se pudo generar un nombre de usuario");
    }

    // --------- Verificar si ese nombre de usuario ya esta registrado ----------
    public boolean existeUsuarioByNombre(String nombreDeUsuario) {
        return usuarioRepository.existsByNombreDeUsuarioAndFueEliminadoFalse(nombreDeUsuario.toLowerCase());
    }
    
    // ============================ OBTENER USUARIO ============================
    public Usuario obtenerEntidad(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        if (usuario.getFueEliminado()) throw new NotFoundException("Usuario eliminado");

        return usuario;
    }

    // ============================ OBTENER USUARIO POR SU NOMBRE DE USUARIO ============================
    public Usuario obtenerUsuarioByNombre(String nombreDeUsuario) {
        Usuario usuario = usuarioRepository.findByNombreDeUsuario(nombreDeUsuario);
    
        if (usuario == null) throw new NotFoundException("Usuario no encontrado");
        if (usuario.getFueEliminado()) throw new NotFoundException("Usuario eliminado");
    
        return usuario;
    }

    // ============================ OBTENER USUARIO POR SU MAIL ============================
    public Usuario obtenerUsuarioByMail(String mail) {
        Usuario usuario = usuarioRepository.findByEmpleadoMail(mail);
    
        if (usuario == null) throw new NotFoundException("Usuario no encontrado");
        if (usuario.getFueEliminado()) throw new NotFoundException("Usuario eliminado");
    
        return usuario;
    }

    // ============================ OBTENER USUARIO POR SU TOKEN ============================
    public Usuario obtenerUsuarioByToken(String tokenPlano) {
        return usuarioRepository.findAll().stream()
            .filter(u -> !u.getFueEliminado())
            .filter(u -> u.getResetToken() != null)
            .filter(u -> passwordEncoder.matches(tokenPlano, u.getResetToken()))
            .findFirst()
            .orElseThrow(() -> new UnauthorizedException("Token inválido"));
    }

    // ============================ ACTUALIZAR ROL DE UN USUARIO ============================
    @Transactional
    public UsuarioResponse actualizarRolUsuario(Long id, UsuarioUpdateRequest usuarioDto) {
        Usuario usuario = obtenerEntidad(id);

        Rol rol = rolService.obtenerEntidad(usuarioDto.getRolId());
        
        usuario.setRol(rol);

        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    // ============================ CAMBIAR CONTRASEÑA DE UN USUARIO (CON CONTRASEÑA ANTERIOR) ============================
    @Transactional
    public Usuario actualizarContraseniaUsuario(Usuario usuario, ContraseniaUpdateRequest contraseniaDto) {
        if (!passwordEncoder.matches(contraseniaDto.getContraseniaActual(), usuario.getContrasenia())) throw new UnauthorizedException("La contraseña actual es incorrecta");
        
        usuario.setContrasenia(passwordEncoder.encode(contraseniaDto.getContraseniaNueva()));
        usuario.setPrimerLogin(false);

        return usuarioRepository.save(usuario);
    }

    // ============================ PEDIR RECUPERACION DE CONTRASEÑA ============================
    @Transactional
    public void recuperarContrasenia(Usuario usuario, String tokenPlano) {
        usuario.setResetToken(passwordEncoder.encode(tokenPlano));

        usuario.setResetTokenExpiracion(LocalDateTime.now().plusMinutes(15));

        usuarioRepository.save(usuario);

        // ---------------------------------- TODO 
        // ENVIAR EL MAIL CON EL LINK DE RECUPERACION (ESE LINK CONTIENE EL TOKEN)
    }

    // ============================ CAMBIAR CONTRASEÑA DE UN USUARIO (CON TOKEN) ============================
    @Transactional
    public void resetearContrasenia(Usuario usuario, String contraseniaNueva) {
        usuario.setContrasenia(passwordEncoder.encode(contraseniaNueva));

        usuario.setPrimerLogin(false);

        usuario.setResetToken(null);

        usuario.setResetTokenExpiracion(null);

        usuarioRepository.save(usuario);
    }
}
