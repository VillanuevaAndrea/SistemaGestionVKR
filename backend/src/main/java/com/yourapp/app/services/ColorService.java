package com.yourapp.app.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.ColorMapper;
import com.yourapp.app.models.dto.color.ColorCreateRequest;
import com.yourapp.app.models.dto.color.ColorResponse;
import com.yourapp.app.models.entities.Color;
import com.yourapp.app.repositories.ColorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ColorService {
    private final ColorRepository colorRepository;
    private final ColorMapper colorMapper;

    // ============================ CREAR COLOR ============================
    @Transactional
    public ColorResponse crearColor(ColorCreateRequest colorDto) {
        if (colorRepository.existsByDescripcionAndFueEliminadoFalse(colorDto.getDescripcion())) throw new ConflictException("La descripción del color ya está en uso");
        Color color = colorMapper.toEntity(colorDto);
        return colorMapper.toResponse(colorRepository.save(color));
    }

    // ============================ ELIMINAR UN COLOR ============================
    @Transactional
    public void eliminarColor(Long id) {
        Color color = obtenerEntidad(id);
        color.softDelete();
        colorRepository.save(color);
    }

    // ============================ OBTENER COLOR (ENTIDAD) ============================
    public Color obtenerEntidad(Long colorId) {
        Color color = colorRepository.findById(colorId).orElseThrow(() -> new NotFoundException("Color no encontrado"));
        if (color.getFueEliminado()) throw new NotFoundException("Color eliminado");
        return color;
    }

    // ============================ OBTENER TODOS LOS COLORES ============================
    public List<ColorResponse> obtenerTodosLosColores() {
        List<Color> colores = colorRepository.findByFueEliminadoFalse();
        return colorMapper.toResponseList(colores);
    }
}
