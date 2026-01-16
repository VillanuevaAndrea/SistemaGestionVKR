package com.yourapp.app.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.RolMapper;
import com.yourapp.app.models.dto.rol.RolCreateRequest;
import com.yourapp.app.models.dto.rol.RolResponse;
import com.yourapp.app.models.dto.rol.RolUpdateRequest;
import com.yourapp.app.models.entities.Rol;
import com.yourapp.app.repositories.RolRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RolService {
    private final RolRepository rolRepository;
    private final RolMapper rolMapper;

    // ============================ CREAR UN ROL ============================
    @Transactional
    public RolResponse crearRol(RolCreateRequest rolDto) {
        if (rolRepository.existsByNombreAndFueEliminadoFalse(rolDto.getNombre())) throw new ConflictException("El nombre del rol ya está en uso");
        Rol rol = rolMapper.toEntity(rolDto);
        return rolMapper.toResponse(rolRepository.save(rol));
    }

    // ============================ ACTUALIZAR LOS PERMISOS DE UN ROL ============================
    @Transactional
    public RolResponse actualizarPermisos(Long rolId, RolUpdateRequest rolDto) {
        Rol rol = obtenerEntidad(rolId);

        rol.getPermisos().clear();
        if (rolDto.getPermisos() != null) rol.getPermisos().addAll(rolDto.getPermisos());
        
        return rolMapper.toResponse(rolRepository.save(rol));
    }
    
    // ============================ ELIMINAR UN ROL ============================
    @Transactional
    public void eliminarRol(Long id) {
        Rol rol = obtenerEntidad(id);
        rol.softDelete();
        rolRepository.save(rol);
    }

    // ============================ OBTENER ROL (ENTIDAD) ============================
    public Rol obtenerEntidad(Long rolId) {
        Rol rol = rolRepository.findById(rolId).orElseThrow(() -> new NotFoundException("Rol no encontrado"));
        if (rol.getFueEliminado()) throw new NotFoundException("Rol eliminado");
        return rol;
    }

    // ============================ OBTENER TODOS LOS ROLES ============================
    public List<RolResponse> obtenerTodosLosRoles() {
        List<Rol> roles = rolRepository.findByFueEliminadoFalse();
        return rolMapper.toResponseList(roles);
    }
}
