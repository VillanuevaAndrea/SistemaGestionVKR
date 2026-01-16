package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.venta.PagoDeCreditoResponse;
import com.yourapp.app.models.entities.PagoDeCredito;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface PagoDeCreditoMapper {
    // --- SALIDA ---
    PagoDeCreditoResponse toResponse(PagoDeCredito entity);

    List<PagoDeCreditoResponse> toResponseList(List<PagoDeCredito> entities);
}
