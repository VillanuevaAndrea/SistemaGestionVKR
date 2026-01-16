package com.yourapp.app.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.cliente.ClienteCreateRequest;
import com.yourapp.app.models.dto.cliente.ClienteResponse;
import com.yourapp.app.models.dto.cliente.ClienteUpdateRequest;
import com.yourapp.app.models.entities.Cliente;

@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ClienteMapper {
    // --- ENTRADA ---
    @Mapping(target = "categoriaCliente", source = "dto.categoria")
    Cliente toEntity(ClienteCreateRequest dto);

    @Mapping(target = "categoriaCliente", source = "updateDto.categoria")
    void updateEntity(ClienteUpdateRequest updateDto, @MappingTarget Cliente clienteEntidad);

    // --- SALIDA ---
    ClienteResponse toResponse(Cliente entity);
}