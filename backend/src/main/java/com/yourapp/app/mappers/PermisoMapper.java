package com.yourapp.app.mappers;

import org.mapstruct.Mapper;

import com.yourapp.app.models.dto.rol.PermisoResponse;
import com.yourapp.app.models.entities.Permiso;

@Mapper(componentModel = "spring")
public interface PermisoMapper {
    // --- SALIDA ---
    default PermisoResponse toResponse(Permiso permiso) {
        if (permiso == null) {
            return null;
        }

        PermisoResponse response = new PermisoResponse();
        response.setCodigo(permiso.name()); 
        response.setDescripcion(permiso.getDescripcion()); 
        
        return response;
    }
}