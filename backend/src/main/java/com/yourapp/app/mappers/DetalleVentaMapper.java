package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.venta.DetalleVentaResponse;
import com.yourapp.app.models.entities.DetalleVenta;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = { DetalleProductoMapper.class }
)
public interface DetalleVentaMapper {
    // --- SALIDA ---
    DetalleVentaResponse toResponse(DetalleVenta detalle);

    List<DetalleVentaResponse> toResponseList(List<DetalleVenta> entities);
}
