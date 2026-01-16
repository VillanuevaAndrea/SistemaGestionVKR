package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.talle.TalleCreateRequest;
import com.yourapp.app.models.dto.talle.TalleResponse;
import com.yourapp.app.models.entities.Talle;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TalleMapper {
    // --- ENTRADA ---
    Talle toEntity(TalleCreateRequest dto);

    // --- SALIDA ---
    TalleResponse toResponse(Talle entity);

    List<TalleResponse> toResponseList(List<Talle> entities);
}
