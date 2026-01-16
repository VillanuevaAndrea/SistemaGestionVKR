package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.producto.ProductoCreateRequest;
import com.yourapp.app.models.dto.producto.ProductoResponse;
import com.yourapp.app.models.dto.producto.ProductoUpdateRequest;
import com.yourapp.app.models.entities.Producto;

@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    imports = { java.util.stream.Collectors.class },
    uses = { DetalleProductoMapper.class, SubcategoriaMapper.class, ProveedorMapper.class }
)
public interface ProductoMapper {
    // --- ENTRADA ---
    Producto toEntity(ProductoCreateRequest dto);

    void updateEntity(ProductoUpdateRequest dto, @MappingTarget Producto entity);

    // --- SALIDA ---
    @Mapping(target = "detalles", source = "detallesProductos")
    ProductoResponse toResponse(Producto entity);

    List<ProductoResponse> toResponseList(List<Producto> entities);
}
