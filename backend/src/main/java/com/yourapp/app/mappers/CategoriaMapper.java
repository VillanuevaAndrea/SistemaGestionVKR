package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.categoria.CategoriaCreateRequest;
import com.yourapp.app.models.dto.categoria.CategoriaResponse;
import com.yourapp.app.models.entities.Categoria;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = { SubcategoriaMapper.class }
)
public interface CategoriaMapper {
    // --- ENTRADA ---
    Categoria toEntity(CategoriaCreateRequest dto);

    // --- SALIDA ---
    CategoriaResponse toResponse(Categoria entity);

    List<CategoriaResponse> toResponseList(List<Categoria> entities);
}
