package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.empleado.EmpleadoCreateRequest;
import com.yourapp.app.models.dto.empleado.EmpleadoResponse;
import com.yourapp.app.models.dto.empleado.EmpleadoUpdateRequest;
import com.yourapp.app.models.entities.Empleado;

@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = { UsuarioMapper.class }
)
public interface EmpleadoMapper {
    // --- ENTRADA ---
    Empleado toEntity(EmpleadoCreateRequest dto);
    
    void updateEntity(EmpleadoUpdateRequest dto, @MappingTarget Empleado entity);

    // --- SALIDA ---
    EmpleadoResponse toResponse(Empleado entity);

    List<EmpleadoResponse> toResponseList(List<Empleado> entities);


}