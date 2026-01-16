package com.yourapp.app.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.SubcategoriaMapper;
import com.yourapp.app.models.dto.subcategoria.SubcategoriaCreateRequest;
import com.yourapp.app.models.dto.subcategoria.SubcategoriaResponse;
import com.yourapp.app.models.entities.Categoria;
import com.yourapp.app.models.entities.Subcategoria;
import com.yourapp.app.repositories.ProductoRepository;
import com.yourapp.app.repositories.SubcategoriaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubcategoriaService {
    private final SubcategoriaRepository subcategoriaRepository;
    private final CategoriaService categoriaService;
    private final ProductoRepository productoRepository;
    private final SubcategoriaMapper subcategoriaMapper;
    
    // ============================ CREAR UNA SUBCATEGORIA ============================
    @Transactional
    public SubcategoriaResponse crearSubcategoria(SubcategoriaCreateRequest subcategoriaDto) {
        if (subcategoriaRepository.existsByDescripcionAndFueEliminadoFalse(subcategoriaDto.getDescripcion())) throw new ConflictException("La descripción de la subcategoría ya está en uso");
        Categoria categoria = categoriaService.obtenerEntidad(subcategoriaDto.getCategoriaId());
        Subcategoria subcategoria = subcategoriaMapper.toEntity(subcategoriaDto);
        subcategoria.setCategoria(categoria);
        return subcategoriaMapper.toResponse(subcategoriaRepository.save(subcategoria));
    }

    // ============================ ELIMINAR UN SUBCATEGORIA ============================
    @Transactional
    public void eliminarSubcategoria(Long id) {
        Subcategoria subcategoria = obtenerEntidad(id);
        if (productoRepository.existsBySubcategoriaIdAndFueEliminadoFalse(id)) throw new ConflictException("No se puede eliminar la subcategoría porque tiene productos asociados");
        subcategoria.softDelete();
        subcategoriaRepository.save(subcategoria);
    }

    // ============================ OBTENER UNA SUBCATEGORIA ============================
    public SubcategoriaResponse obtenerSubcategoria(Long subcategoriaId) {
        return subcategoriaMapper.toResponse(obtenerEntidad(subcategoriaId));
    }

    // ============================ OBTENER UNA SUBCATEGORIA (ENTIDAD) ============================
    public Subcategoria obtenerEntidad(Long subcategoriaId) {
        Subcategoria subcategoria = subcategoriaRepository.findById(subcategoriaId).orElseThrow(() -> new NotFoundException("Subcategoría no encontrada"));
        if (subcategoria.getFueEliminado() || subcategoria.getCategoria().getFueEliminado()) throw new NotFoundException("Subcategoria o categoria eliminada");
        return subcategoria;
    }
}
