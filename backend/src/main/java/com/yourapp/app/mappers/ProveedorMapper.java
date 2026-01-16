package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.proveedor.ProveedorCreateRequest;
import com.yourapp.app.models.dto.proveedor.ProveedorResponse;
import com.yourapp.app.models.entities.Proveedor;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ProveedorMapper {
    // --- ENTRADA ---
    Proveedor toEntity(ProveedorCreateRequest dto);

    // --- SALIDA ---
    ProveedorResponse toResponse(Proveedor entity);

    List<ProveedorResponse> toResponseList(List<Proveedor> entities);
}

