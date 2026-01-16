package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.subcategoria.SubcategoriaCreateRequest;
import com.yourapp.app.models.dto.subcategoria.SubcategoriaDetalleResponse;
import com.yourapp.app.models.dto.subcategoria.SubcategoriaResponse;
import com.yourapp.app.models.entities.Subcategoria;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SubcategoriaMapper {
    // --- ENTRADA ---
    Subcategoria toEntity(SubcategoriaCreateRequest dto);
    
    // --- SALIDA ---
    SubcategoriaResponse toResponse(Subcategoria entity);
    
    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "categoriaDescripcion", source = "categoria.descripcion")
    SubcategoriaDetalleResponse toDetalleResponse(Subcategoria entity);

    List<SubcategoriaResponse> toResponseList(List<Subcategoria> entities);
}