package com.yourapp.app.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.ProveedorMapper;
import com.yourapp.app.models.dto.proveedor.ProveedorCreateRequest;
import com.yourapp.app.models.dto.proveedor.ProveedorResponse;
import com.yourapp.app.models.entities.Proveedor;
import com.yourapp.app.repositories.ProveedorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProveedorService {
    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;

    // ============================ CREAR UN PROVEEDOR ============================
    @Transactional
    public ProveedorResponse crearProveedor(ProveedorCreateRequest proveedorDto) {
        if (proveedorRepository.existsByNombreAndFueEliminadoFalse(proveedorDto.getNombre())) throw new ConflictException("El nombre del proveedor ya está en uso");
        Proveedor proveedor = proveedorMapper.toEntity(proveedorDto);
        return proveedorMapper.toResponse(proveedorRepository.save(proveedor));
    }

    // ============================ ELIMINAR UN PROVEEDOR ============================
    @Transactional
    public void eliminarProveedor(Long id) {
        Proveedor proveedor = obtenerEntidad(id);
        proveedor.softDelete();
        proveedorRepository.save(proveedor);
    }

    // ============================ OBTENER PROVEEDOR (ENTIDAD) ============================
    public Proveedor obtenerEntidad(Long proveedorId) {
        Proveedor proveedor = proveedorRepository.findById(proveedorId).orElseThrow(() -> new NotFoundException("Proveedor no encontrado"));
        if (proveedor.getFueEliminado()) throw new NotFoundException("Proveedor eliminado");
        return proveedor;
    }

    // ============================ OBTENER TODOS LOS PROVEEDORES ============================
    public List<ProveedorResponse> obtenerTodosLosProveedores() {
        List<Proveedor> proveedores = proveedorRepository.findByFueEliminadoFalse();
        return proveedorMapper.toResponseList(proveedores);
    }
}
