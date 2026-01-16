package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.venta.VentaResponse;
import com.yourapp.app.models.entities.Venta;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = { DetalleVentaMapper.class, PagoDeCreditoMapper.class, EmpleadoMapper.class, ClienteMapper.class }
)
public interface VentaMapper {
    // --- SALIDA ---
    VentaResponse toResponse(Venta entity);

    List<VentaResponse> toResponseList(List<Venta> entities);
}
