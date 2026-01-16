package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.producto.DetalleProductoCreateRequest;
import com.yourapp.app.models.dto.producto.DetalleProductoResponse;
import com.yourapp.app.models.dto.producto.DetalleProductoVentaResponse;
import com.yourapp.app.models.entities.DetalleProducto;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = { TalleMapper.class, ColorMapper.class }
)
public interface DetalleProductoMapper {
    // --- ENTRADA ---
    DetalleProducto toEntity(DetalleProductoCreateRequest dto);

    // --- SALIDA ---
    DetalleProductoResponse toResponse(DetalleProducto entity);

    @Mapping(target = "productoNombre", source = "producto.nombre")
    @Mapping(target = "productoPrecio", source = "producto.precio")
    @Mapping(target = "talleNombre", source = "talle.descripcion")
    @Mapping(target = "colorNombre", source = "color.descripcion")
    DetalleProductoVentaResponse toDetalleResponse(DetalleProducto entity);

    List<DetalleProductoResponse> toResponseList(List<DetalleProducto> entities);
}