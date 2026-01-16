package com.yourapp.app.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yourapp.app.models.dto.color.ColorCreateRequest;
import com.yourapp.app.models.dto.color.ColorResponse;
import com.yourapp.app.models.entities.Color;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ColorMapper {
    // --- ENTRADA ---
    Color toEntity(ColorCreateRequest dto);

    // --- SALIDA ---
    ColorResponse toResponse(Color entity);

    List<ColorResponse> toResponseList(List<Color> entities);
}