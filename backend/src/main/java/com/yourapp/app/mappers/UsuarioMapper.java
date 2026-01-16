package com.yourapp.app.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.usuario.UsuarioMeResponse;
import com.yourapp.app.models.dto.usuario.UsuarioResponse;
import com.yourapp.app.models.entities.Usuario;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = { RolMapper.class, EmpleadoMapper.class }
)
public interface UsuarioMapper {
    // --- SALIDA ---
    UsuarioResponse toResponse(Usuario entity);

    @Mapping(target = "empleadoId", source = "empleado.id")
    @Mapping(target = "empleadoMail", source = "empleado.mail")
    @Mapping(target = "empleadoTelefono", source = "empleado.telefono")
    UsuarioMeResponse toMeResponse(Usuario entity);
}