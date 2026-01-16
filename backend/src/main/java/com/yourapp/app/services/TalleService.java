package com.yourapp.app.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.TalleMapper;
import com.yourapp.app.models.dto.talle.TalleCreateRequest;
import com.yourapp.app.models.dto.talle.TalleResponse;
import com.yourapp.app.models.entities.Talle;
import com.yourapp.app.repositories.TalleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TalleService {
    private final TalleRepository talleRepository;
    private final TalleMapper talleMapper;

    // ============================ CREAR TALLE ============================
    @Transactional
    public TalleResponse crearTalle(TalleCreateRequest talleDto) {
        if (talleRepository.existsByDescripcionAndFueEliminadoFalse(talleDto.getDescripcion())) throw new ConflictException("La descripción del talle ya está en uso");
        Talle talle = talleMapper.toEntity(talleDto);
        return talleMapper.toResponse(talleRepository.save(talle));
    }

    // ============================ ELIMINAR UN TALLE ============================
    @Transactional
    public void eliminarTalle(Long id) {
        Talle talle = obtenerEntidad(id);
        talle.softDelete();
        talleRepository.save(talle);
    }

    // ============================ OBTENER TALLE (ENTIDAD) ============================
    public Talle obtenerEntidad(Long talleId) {
        Talle talle = talleRepository.findById(talleId).orElseThrow(() -> new NotFoundException("Talle no encontrado"));
        if (talle.getFueEliminado()) throw new NotFoundException("Talle eliminado");
        return talle;
    }

    // ============================ OBTENER TODOS LOS TALLES ============================
    public List<TalleResponse> obtenerTodosLosTalles() {
        List<Talle> talles = talleRepository.findByFueEliminadoFalse();
        return talleMapper.toResponseList(talles);
    }
}
