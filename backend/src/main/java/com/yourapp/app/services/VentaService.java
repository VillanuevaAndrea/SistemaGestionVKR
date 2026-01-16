package com.yourapp.app.services;

import com.yourapp.app.exceptions.BadRequestException;
import com.yourapp.app.exceptions.ConflictException;
import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.VentaMapper;
import com.yourapp.app.models.dto.venta.DetalleVentaCreateRequest;
import com.yourapp.app.models.dto.venta.VentaUpdateRequest;
import com.yourapp.app.models.dto.venta.VentaCreateRequest;
import com.yourapp.app.models.dto.venta.VentaDiariaResponse;
import com.yourapp.app.models.dto.venta.VentaQuery;
import com.yourapp.app.models.dto.venta.VentaMotivoRequest;
import com.yourapp.app.models.dto.venta.VentaPagoRequest;
import com.yourapp.app.models.dto.venta.VentaReservaRequest;
import com.yourapp.app.models.dto.venta.VentaResponse;
import com.yourapp.app.models.entities.*;
import com.yourapp.app.models.entities.Cliente.CategoriaCliente;
import com.yourapp.app.models.entities.Venta.MetodoPago;
import com.yourapp.app.models.entities.state.*;
import com.yourapp.app.repositories.*;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoService productoService;
    private final ClienteService clienteService;
    private final AuthService authService;
    private final VentaMapper ventaMapper;

    // ============================ CREAR UNA VENTA ============================
    public VentaResponse crearVenta(VentaCreateRequest ventaDto) {
        return ventaMapper.toResponse(crearVentaEntidad(ventaDto));
    }

    // ============================ CREAR VENTA (ENTIDAD) ============================
    @Transactional
    public Venta crearVentaEntidad(VentaCreateRequest ventaDto) {
        if (ventaDto.getDetalles() == null || ventaDto.getDetalles().isEmpty()) throw new BadRequestException("No se puede crear una venta sin productos");

        // ---------- VALIDACION PARA EVITAR PRODUCTOS REPETIDOS ----------
        long codigosUnicos = ventaDto.getDetalles().stream().map(DetalleVentaCreateRequest::getCodigo).distinct().count();
        if (codigosUnicos < ventaDto.getDetalles().size()) throw new BadRequestException("La lista contiene códigos de producto duplicados. Agrupe las cantidades.");

        // ---------- CREAR LA VENTA BASE ----------
        Usuario usuario = authService.obtenerUsuarioLogueado();
        Empleado empleado = usuario.getEmpleado();
        Cliente cliente = (ventaDto.getClienteId() != null) ? clienteService.obtenerEntidad(ventaDto.getClienteId()) : null;

        Venta venta = new Venta();
        venta.setEmpleado(empleado);
        venta.setCliente(cliente);

        VentaIniciada estadoInicial = new VentaIniciada();
        estadoInicial.setVenta(venta);
        venta.setEstado(estadoInicial);
        venta.setFecha(LocalDateTime.now());

        // ---------- CARGAR TODOS LOS PRODUCTOS ----------
        for (DetalleVentaCreateRequest detalleDto : ventaDto.getDetalles()) {
            DetalleProducto detalleProducto = productoService.obtenerDetalleByCodigo(detalleDto.getCodigo());

            if (detalleProducto.getStockDisponible() < detalleDto.getCantidad()) throw new ConflictException("Stock insuficiente para: " + detalleProducto.getProducto().getNombre() + " [" + detalleDto.getCodigo() + "]");

            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setDetalleProducto(detalleProducto);
            detalleVenta.setCantidad(detalleDto.getCantidad());
            detalleVenta.setPrecioUnitarioActual(detalleProducto.getProducto().getPrecio().doubleValue());
            detalleVenta.calcularPrecioTotal();

            venta.agregarDetalle(detalleVenta);
        }

        // ---------- CALCULAR EL TOTAL Y GUARDAR ----------
        venta.calcularTotal();
        
        return ventaRepository.save(venta);
    }

    // ============================ OBTENER UNA VENTA POR ID ============================
    public VentaResponse obtenerVenta(Long ventaId) {
        return ventaMapper.toResponse(obtenerEntidad(ventaId));
    }

    // ============================ OBTENER VENTA (ENTIDAD) ============================
    public Venta obtenerEntidad(Long ventaId) {
        Venta venta = ventaRepository.findById(ventaId).orElseThrow(() -> new NotFoundException("Venta no encontrada"));

        if (venta.getFueEliminado()) throw new NotFoundException("Venta eliminada");

        return venta;
    }

    // ============================ ELIMINAR UNA VENTA + DETALLES DE LA VENTA + PAGOS DE CREDITO ============================
    @Transactional
    public void eliminarVenta(Long id) {
        Venta venta = obtenerEntidad(id);

        if (!(venta.getEstado() instanceof VentaIniciada)) throw new ConflictException("No se puede eliminar una venta que ya ha sido procesada");
    
        venta.softDelete();

        ventaRepository.save(venta);
    }

    // ============================ PAGAR POR COMPLETO UNA VENTA ============================
    @Transactional
    public VentaResponse pagarVentaCompleta(Long ventaId, VentaPagoRequest ventaDto) {
        Venta venta = obtenerEntidad(ventaId);

        if (!(venta.getEstado() instanceof VentaIniciada)) throw new ConflictException("Solo se pueden pagar ventas INICIADAS");
        
        if (ventaDto.getMetodoPago() == MetodoPago.CREDITO) throw new ConflictException("Crédito solo para reservas");

        venta.getEstado().cobrarTotal(venta.getSaldoPendiente(), ventaDto.getMetodoPago());

        VentaPagada nuevoEstado = new VentaPagada();
        nuevoEstado.setVenta(venta);
        venta.setEstado(nuevoEstado);
        venta.setMetodoPago(ventaDto.getMetodoPago());
        venta.setFecha(LocalDateTime.now());

        return ventaMapper.toResponse(ventaRepository.save(venta));
    }

    // ============================ RESERVAR UNA VENTA CON SEÑA ============================
    @Transactional
    public VentaResponse reservarConCredito(Long ventaId, VentaReservaRequest ventaDto) {
        Venta venta = obtenerEntidad(ventaId);

        if (venta.getCliente().getCategoriaCliente() == CategoriaCliente.NO_CONFIABLE) throw new ConflictException("Los clientes NO CONFIABLES no pueden realizar reservas"); 

        if (!(venta.getEstado() instanceof VentaIniciada)) throw new ConflictException("Solo se pueden reservar ventas INICIADAS");
        
        venta.getEstado().reservarConCredito(ventaDto.getMonto());

        VentaReservada nuevoEstado = new VentaReservada();
        nuevoEstado.setVenta(venta);
        venta.setEstado(nuevoEstado);
        venta.setMetodoPago(MetodoPago.CREDITO);

        return ventaMapper.toResponse(ventaRepository.save(venta));
    }

    // ============================ AGREGAR UN PAGO A UNA VENTA RESERVADA ============================
    @Transactional
    public VentaResponse agregarPagoParcialCredito(Long ventaId, VentaReservaRequest ventaDto) {
        Venta venta = obtenerEntidad(ventaId);

        if (!(venta.getEstado() instanceof VentaReservada)) throw new ConflictException("Solo se pueden agregar pagos a ventas RESERVADAS");
        
        venta.getEstado().agregarPagoCredito(ventaDto.getMonto());

        if (venta.estaCompletamentePagada()) {
            VentaPagada nuevoEstado = new VentaPagada();
            nuevoEstado.setVenta(venta);
            venta.setEstado(nuevoEstado);
        }

        return ventaMapper.toResponse(ventaRepository.save(venta));
    }

    // ============================ CANCELAR UNA VENTA ============================
    @Transactional
    public VentaResponse cancelarVenta(Long ventaId, VentaMotivoRequest ventaDto) {
        Venta venta = obtenerEntidad(ventaId);

        venta.getEstado().cancelar(ventaDto.getMotivo());

        VentaCancelada nuevoEstado = new VentaCancelada();
        nuevoEstado.setVenta(venta);
        venta.setEstado(nuevoEstado);

        return ventaMapper.toResponse(ventaRepository.save(venta));
    }

    // ============================ RECHAZAR UNA VENTA ============================
    @Transactional
    public VentaResponse rechazarVenta(Long ventaId, VentaMotivoRequest ventaDto) {
        Venta venta = obtenerEntidad(ventaId);

        venta.getEstado().rechazar(ventaDto.getMotivo());

        VentaRechazada nuevoEstado = new VentaRechazada();
        nuevoEstado.setVenta(venta);
        venta.setEstado(nuevoEstado);

        return ventaMapper.toResponse(ventaRepository.save(venta));
    }

    // ============================ CAMBIAR PRODUCTOS DE UNA VENTA (PAGADA O RESERVADA) ============================
    @Transactional
    public VentaResponse procesarCambioProducto(Long ventaOriginalId, VentaUpdateRequest ventaDto) {
        Venta ventaOriginal = obtenerEntidad(ventaOriginalId);

        if (ventaOriginal.getCliente() == null) throw new BadRequestException("No se puede realizar un cambio en una venta sin cliente asociado. Identifique al cliente primero.");

        Double totalOriginal = ventaOriginal.getTotal();
        Double montoPagadoOriginal = ventaOriginal.getMontoPagado();

        // ---------- CANCELAR VENTA ORIGINAL ----------
        VentaMotivoRequest ventaCancelacionDto = new VentaMotivoRequest();
        ventaCancelacionDto.setMotivo(ventaDto.getMotivo());

        cancelarVenta(ventaOriginalId, ventaCancelacionDto);

        // ---------- CREAR NUEVA VENTA ----------
        VentaCreateRequest nuevaVentaDto = new VentaCreateRequest();
        nuevaVentaDto.setClienteId(ventaOriginal.getCliente().getId());
        nuevaVentaDto.setDetalles(ventaDto.getDetalles());

        Venta nuevaVenta = crearVentaEntidad(nuevaVentaDto);

        Double totalNuevo = nuevaVenta.getTotal();

        // ---------- REGLA DE NEGOCIO ----------
        if (totalNuevo < totalOriginal) throw new ConflictException("El cambio de productos debe ser por un monto igual o mayor a la venta original");

        // ---------- TRANSFERIR PAGO ----------
        nuevaVenta.setMontoPagado(montoPagadoOriginal);

        if (totalNuevo.equals(totalOriginal)) {
            // Queda PAGADA
            VentaPagada estado = new VentaPagada();
            estado.setVenta(nuevaVenta);
            nuevaVenta.setEstado(estado);
            nuevaVenta.setFecha(LocalDateTime.now());
            nuevaVenta.setMetodoPago(ventaOriginal.getMetodoPago());
        }

        return ventaMapper.toResponse(ventaRepository.save(nuevaVenta));
    }


    // ============================ CANCELAR VENTAS VENCIDAS ============================
    @Transactional
    public void procesarReservasVencidas() {
        List<Venta> ventasReservadas = ventaRepository.findByEstado(VentaReservada.class);
        for (Venta venta : ventasReservadas) {
            if (venta.getEstado() instanceof VentaReservada) {
                ((VentaReservada) venta.getEstado()).procesar();
            }
        }
    }

    // ============================ OBTENER VENTAS CON FILTROS ============================
    public Page<VentaResponse> obtenerVentasFiltradas(VentaQuery filtros) {
        // --------- ORDENAMIENTO ----------
        Sort sort = Sort.unsorted();
        if (filtros.getOrden() != null) {
            List<String> camposPermitidos = List.of("fecha", "total", "montoPagado", "fechaVencimientoReserva");

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
        Specification<Venta> spec = (root, query, cb) -> cb.conjunction();

        // Filtrar por empleado
        if (filtros.getEmpleadoId() != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("empleado").get("id"), filtros.getEmpleadoId())
            );
        }

        // Filtrar por cliente
        if (filtros.getCliente() != null && !filtros.getCliente().trim().isEmpty()) {
            String match = "%" + filtros.getCliente().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> {
                var cliente = root.join("cliente");
                return cb.or(
                    cb.like(cb.lower(cliente.get("nombre")), match),
                    cb.like(cb.lower(cliente.get("apellido")), match),
                    cb.like(cb.lower(cliente.get("dni")), match)
                );
            });
        }

        // Filtrar por método de pago
        if (filtros.getMetodoPago() != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("metodoPago"), filtros.getMetodoPago())
            );
        }

        // Filtrar por estado (nombre de la clase de VentaState)
        if (filtros.getEstado() != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("estadoNombre"), filtros.getEstado())
            );
        }

        // --------- PAGINACION ----------
        int pagina = (filtros.getPagina() != null && filtros.getPagina() >= 0) ? filtros.getPagina() : 0;
        int tamanio = 10;
        Pageable pageable = PageRequest.of(pagina, tamanio, sort);

        // --------- CONSULTA ----------
        Page<Venta> ventas = ventaRepository.findAll(spec, pageable);
        
        return ventas.map(ventaMapper::toResponse);
    }

    public Double obtenerMetricasDashboard() {
        // Calculamos el primer día del mes actual a las 00:00
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        // 1. Suma de dinero del mes (solo pagadas)
        Double ingresosMes = ventaRepository.sumarTotalVentasDesde("VentaPagada", inicioMes);
        if (ingresosMes == null) ingresosMes = 0.0; 

        return ingresosMes;
    }

    public List<VentaDiariaResponse> obtenerVentasMensuales() {
        LocalDateTime inicioMes = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);

        return ventaRepository.obtenerVentasMensuales(inicioMes);
    }
};
