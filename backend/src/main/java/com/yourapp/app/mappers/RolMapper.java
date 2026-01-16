package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.rol.RolCreateRequest;
import com.yourapp.app.models.dto.rol.RolResponse;
import com.yourapp.app.models.entities.Rol;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = { PermisoMapper.class }
)
public interface RolMapper {
    // --- ENTRADA ---
    Rol toEntity(RolCreateRequest dto);

    // --- SALIDA ---
    RolResponse toResponse(Rol entity);
    
    List<RolResponse> toResponseList(List<Rol> entities);
}
