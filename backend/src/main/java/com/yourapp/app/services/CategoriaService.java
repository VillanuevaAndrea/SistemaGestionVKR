package com.yourapp.app.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.CategoriaMapper;
import com.yourapp.app.models.dto.categoria.CategoriaCreateRequest;
import com.yourapp.app.models.dto.categoria.CategoriaResponse;
import com.yourapp.app.models.entities.Categoria;
import com.yourapp.app.repositories.CategoriaRepository;
import com.yourapp.app.repositories.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaMapper categoriaMapper;

    // ============================ CREAR CATEGORIA ============================
    @Transactional
    public CategoriaResponse crearCategoria(CategoriaCreateRequest categoriaDto) {
        if (categoriaRepository.existsByDescripcionAndFueEliminadoFalse(categoriaDto.getDescripcion())) throw new ConflictException("La descripción de la categoria ya está en uso");
        Categoria categoria = categoriaMapper.toEntity(categoriaDto);
        Categoria guardada = categoriaRepository.save(categoria);
        return categoriaMapper.toResponse(guardada);
    }

    // ============================ ELIMINAR UNA CATEGORIA + SUBCATEGORIAS ============================
    @Transactional
    public void eliminarCategoria(Long id) {
        Categoria categoria = obtenerEntidad(id);
        if (productoRepository.existsBySubcategoriaCategoriaIdAndFueEliminadoFalse(id)) throw new ConflictException("No se puede eliminar la categoría: una o más de sus subcategorías tienen productos asociados");
        categoria.softDelete();
        categoriaRepository.save(categoria);
    }

    // ============================ OBTENER TODAS LAS CATEGORIAS ============================
    public List<CategoriaResponse> obtenerTodasLasCategorias() {
        List<Categoria> categorias = categoriaRepository.findByFueEliminadoFalse();

        categorias.forEach(categoria -> {
            if (categoria.getSubcategorias() != null) categoria.getSubcategorias().removeIf(sub -> sub.getFueEliminado());
        });

        return categoriaMapper.toResponseList(categorias);
    }

    // ============================ OBTENER UNA CATEGORIA (ENTIDAD) ============================
    public Categoria obtenerEntidad(Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new NotFoundException("Categoria no encontrada"));
        if (categoria.getFueEliminado()) throw new NotFoundException("Categoria eliminada");
        return categoria;
    }
}
