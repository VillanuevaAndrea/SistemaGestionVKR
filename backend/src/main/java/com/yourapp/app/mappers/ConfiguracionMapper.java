package com.yourapp.app.mappers;

import org.mapstruct.*;

import com.yourapp.app.models.dto.configuracion.ConfiguracionResponse;
import com.yourapp.app.models.dto.configuracion.ConfiguracionUpdateRequest;
import com.yourapp.app.models.entities.ConfiguracionTienda;

@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ConfiguracionMapper {
    // --- ENTRADA ---
    void updateEntity(ConfiguracionUpdateRequest dto, @MappingTarget ConfiguracionTienda entity);

    // --- SALIDA ---
    ConfiguracionResponse toResponse(ConfiguracionTienda entity);
}
