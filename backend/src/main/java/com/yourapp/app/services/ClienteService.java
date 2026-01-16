package com.yourapp.app.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.yourapp.app.exceptions.BadRequestException;
import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.ClienteMapper;
import com.yourapp.app.models.dto.cliente.ClienteCreateRequest;
import com.yourapp.app.models.dto.cliente.ClienteQuery;
import com.yourapp.app.models.dto.cliente.ClienteResponse;
import com.yourapp.app.models.dto.cliente.ClienteUpdateRequest;
import com.yourapp.app.models.entities.Cliente;
import com.yourapp.app.repositories.ClienteRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;
 
    // ============================ CREAR UN CLIENTE ============================
    @Transactional
    public ClienteResponse crearCliente(ClienteCreateRequest clienteDto) {
        if (clienteRepository.existsByDniAndFueEliminadoFalse(clienteDto.getDni())) throw new ConflictException("El DNI ya esta asignado a otro cliente");
        
        Cliente cliente = clienteMapper.toEntity(clienteDto);

        return clienteMapper.toResponse(clienteRepository.save(cliente));
    }

    // ============================ OBTENER UN CLIENTE ============================
    public ClienteResponse obtenerCliente(Long id) {
        return clienteMapper.toResponse(obtenerEntidad(id));
    }
    
    // ============================ OBTENER UN CLIENTE (ENTIDAD) ============================
    public Cliente obtenerEntidad(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new NotFoundException("Cliente no encontrado"));
        if (cliente.getFueEliminado()) throw new NotFoundException(("Cliente eliminado"));
        return cliente;
    }

    // ============================ ACTUALIZAR UN CLIENTE ============================
    @Transactional
    public ClienteResponse actualizarCliente(Long id, ClienteUpdateRequest clienteDto) {
        Cliente cliente = obtenerEntidad(id);

        clienteMapper.updateEntity(clienteDto, cliente);

        return clienteMapper.toResponse(clienteRepository.save(cliente)); 
    }

    // ============================ ELIMINAR UN CLIENTE ============================
    @Transactional
    public void eliminarCliente(Long id) {
        Cliente cliente = obtenerEntidad(id);

        cliente.softDelete();

        clienteRepository.save(cliente);
    }

    // ============================ OBTENER CLIENTES CON FILTROS ============================
    public Page<ClienteResponse> obtenerClientesFiltrados(ClienteQuery filtros) {
        // --------- ORDENAMIENTO ----------
        Sort sort = Sort.unsorted();

        if (filtros.getOrden() != null) {
            List<String> camposPermitidos = List.of("nombre", "apellido", "dni", "creditoLimite", "deuda");

            String campo = filtros.getOrden().toLowerCase();

            if (camposPermitidos.contains(campo)) {
                Sort.Direction direccion = Sort.Direction.ASC;
                if ("desc".equalsIgnoreCase(filtros.getDireccion())) {
                    direccion = Sort.Direction.DESC;
                }
                sort = Sort.by(direccion, campo);
            } else {
                throw new BadRequestException("No se puede ordenar por el campo: " + campo);
            }
        }

        // --------- ESPECIFICACION ----------
        Specification<Cliente> spec = (root, query, cb) -> cb.conjunction();

        spec = spec.and((root, query, cb) -> cb.isFalse(root.get("fueEliminado")));

        // FILTRO GLOBAL (Nombre OR Apellido OR DNI)
        if (filtros.getNombre() != null && !filtros.getNombre().isBlank()) {
            String valorBusqueda = "%" + filtros.getNombre().toLowerCase() + "%";
            
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("nombre")), valorBusqueda),
                    cb.like(cb.lower(root.get("apellido")), valorBusqueda),
                    cb.like(root.get("dni"), valorBusqueda) // Usamos like por si mandan DNI parcial
                )
            );
        }

        // Filtrar por categoría (Este se mantiene afuera con AND porque es un filtro extra)
        if (filtros.getCategoria() != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("categoriaCliente"), filtros.getCategoria())
            );
        }

        // --------- PAGINACION ----------
        int pagina = (filtros.getPagina() != null && filtros.getPagina() >= 0) ? filtros.getPagina() : 0;
        int tamanio = 10;
        Pageable pageable = PageRequest.of(pagina, tamanio, sort);

        // --------- CONSULTA ----------
        Page<Cliente> clientes = clienteRepository.findAll(spec, pageable);
        return clientes.map(clienteMapper::toResponse);
    }
}
