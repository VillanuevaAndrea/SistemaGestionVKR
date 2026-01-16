package com.yourapp.app.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourapp.app.exceptions.BadRequestException;
import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.EmpleadoMapper;
import com.yourapp.app.models.dto.empleado.EmpleadoCreateRequest;
import com.yourapp.app.models.dto.empleado.EmpleadoQuery;
import com.yourapp.app.models.dto.empleado.EmpleadoResponse;
import com.yourapp.app.models.dto.empleado.EmpleadoUpdateRequest;
import com.yourapp.app.models.entities.Empleado;
import com.yourapp.app.models.entities.Usuario;
import com.yourapp.app.repositories.EmpleadoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpleadoService {
    private final EmpleadoRepository empleadoRepository;
    private final UsuarioService usuarioService;
    private final EmpleadoMapper empleadoMapper;

    // ============================ CREAR EMPLEADO (CREANDOLE ADEMAS SU USUARIO) ============================
    @Transactional
    public EmpleadoResponse crearEmpleado(EmpleadoCreateRequest empleadoDto) {
        if (empleadoRepository.existsByDniAndFueEliminadoFalse(empleadoDto.getDni())) throw new ConflictException("Ya existe un empleado con el DNI proporcionado");

        Usuario usuario = usuarioService.crearUsuario(empleadoDto);

        Empleado empleado = empleadoMapper.toEntity(empleadoDto);

        empleado.setUsuario(usuario);
        usuario.setEmpleado(empleado);

        return empleadoMapper.toResponse(empleadoRepository.save(empleado));
    }

    // ============================ OBTENER UN EMPLEADO ============================
    public EmpleadoResponse obtenerEmpleado(Long id) {
        return empleadoMapper.toResponse(obtenerEntidad(id));
    }

    // ============================ OBTENER EMPLEADO (ENTIDAD) ============================
    public Empleado obtenerEntidad(Long id) {
        Empleado empleado = empleadoRepository.findById(id).orElseThrow(() -> new NotFoundException("Empleado no encontrado"));
        if (empleado.getFueEliminado()) throw new NotFoundException("Empleado eliminado");
        return empleado;
    }

    // ============================ ACTUALIZAR UN EMPLEADO ============================
    @Transactional
    public EmpleadoResponse actualizarEmpleado(Long id, EmpleadoUpdateRequest empleadoDto) {
        Empleado empleado = obtenerEntidad(id);

        empleadoMapper.updateEntity(empleadoDto, empleado);

        return empleadoMapper.toResponse(empleadoRepository.save(empleado));
    }

    // ============================ ELIMINAR UN EMPLEADO + SU USUARIO ============================
    @Transactional
    public void eliminarEmpleado(Long id) {
        Empleado empleado = obtenerEntidad(id);

        empleado.softDelete();
        
        empleadoRepository.save(empleado);
    }

    // ============================ OBTENER EMPLEADOS CON FILTROS ============================
    public Page<EmpleadoResponse> obtenerEmpleadosFiltrados(EmpleadoQuery filtros) {
        // --------- ORDENAMIENTO ----------
        Sort sort = Sort.unsorted();

        if (filtros.getOrden() != null) {
            List<String> camposPermitidos = List.of("nombre", "apellido", "dni");

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
        Specification<Empleado> spec = (root, query, cb) -> cb.conjunction();

        spec = spec.and((root, query, cb) -> cb.isFalse(root.get("fueEliminado")));

        if (filtros.getNombre() != null && !filtros.getNombre().isBlank()) {
            String valorBusqueda = "%" + filtros.getNombre().toLowerCase() + "%";
            
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("nombre")), valorBusqueda),
                    cb.like(cb.lower(root.get("apellido")), valorBusqueda),
                    cb.like(root.get("dni"), valorBusqueda) 
                )
            );
        }

        // Filtrar por empleados con / sin usuario
        if (filtros.getTieneUsuario() != null) {
            if (Boolean.TRUE.equals(filtros.getTieneUsuario())) {
                spec = spec.and((root, query, cb) ->
                    cb.isNotNull(root.get("usuario"))
                );
            } else {
                spec = spec.and((root, query, cb) ->
                    cb.isNull(root.get("usuario"))
                );
            }
        }

        // --------- PAGINACION ----------
        int pagina = (filtros.getPagina() != null && filtros.getPagina() >= 0) ? filtros.getPagina() : 0;
        int tamanio = 10;
        Pageable pageable = PageRequest.of(pagina, tamanio, sort);

        // --------- CONSULTA ----------
        Page<Empleado> empleados = empleadoRepository.findAll(spec, pageable);

        return empleados.map(empleadoMapper::toResponse);
    }
}
