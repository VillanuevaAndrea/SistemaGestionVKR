package com.yourapp.app.controllers;

import java.util.Collections;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.models.dto.venta.VentaUpdateRequest;
import com.yourapp.app.models.dto.venta.VentaCreateRequest;
import com.yourapp.app.models.dto.venta.VentaDiariaResponse;
import com.yourapp.app.models.dto.venta.VentaQuery;
import com.yourapp.app.models.dto.venta.VentaMotivoRequest;
import com.yourapp.app.models.dto.venta.VentaPagoRequest;
import com.yourapp.app.models.dto.venta.VentaReservaRequest;
import com.yourapp.app.models.dto.venta.VentaResponse;
import com.yourapp.app.services.VentaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
public class VentaController {
    private final VentaService ventaService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('VENTA_CREAR')")
    public VentaResponse crearVenta(@RequestBody @Valid VentaCreateRequest ventaDto) {
        return ventaService.crearVenta(ventaDto);
    }

    @GetMapping("/{id}") 
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('VENTA_VER')")
    public VentaResponse obtenerVenta(@PathVariable Long id) {
        return ventaService.obtenerVenta(id);
    }

    @PatchMapping("/{id}/pago")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('VENTA_PAGAR')")
    public VentaResponse pagarVentaCompleta(@PathVariable Long id, @RequestBody @Valid VentaPagoRequest ventaDto) {
        return ventaService.pagarVentaCompleta(id, ventaDto);
    }

    @PostMapping("/{id}/reserva")
    @ResponseStatus(HttpStatus.CREATED) 
    @PreAuthorize("hasAuthority('VENTA_RESERVAR')")
    public VentaResponse reservarConCredito(@PathVariable Long id, @RequestBody @Valid VentaReservaRequest ventaDto) {
        return ventaService.reservarConCredito(id, ventaDto);
    }

    @PostMapping("/{id}/reserva-pagos")
    @ResponseStatus(HttpStatus.CREATED) 
    @PreAuthorize("hasAuthority('VENTA_RESERVAR')")
    public VentaResponse agregarPagoParcialCredito(@PathVariable Long id, @RequestBody @Valid VentaReservaRequest ventaDto) {
        return ventaService.agregarPagoParcialCredito(id, ventaDto);
    }

    @PatchMapping("/{id}/cancelacion")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('VENTA_CANCELAR')")
    public VentaResponse cancelarVenta(@PathVariable Long id, @RequestBody @Valid VentaMotivoRequest ventaDto) {
        return ventaService.cancelarVenta(id, ventaDto);
    }

    @PatchMapping("/{id}/rechazo")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('VENTA_CANCELAR')")
    public VentaResponse rechazarVenta(@PathVariable Long id, @RequestBody @Valid VentaMotivoRequest ventaDto) {
        return ventaService.rechazarVenta(id, ventaDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('VENTA_ELIMINAR')")
    public void eliminarVenta(@PathVariable Long id) {
        ventaService.eliminarVenta(id);
    }

    @PatchMapping("/{id}/cambio")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('VENTA_CAMBIAR')")
    public VentaResponse procesarCambioProducto(@PathVariable Long id, @RequestBody @Valid VentaUpdateRequest ventaCambioDto) {
        return ventaService.procesarCambioProducto(id, ventaCambioDto);
    }

    @GetMapping("/reservas-vencidas")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('VENTA_PROCESAR')")
    public void procesarReservasVencidas() {
        ventaService.procesarReservasVencidas(); // Cancela las ventas reservadas vencidas
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('VENTA_VER')")
    public Page<VentaResponse> obtenerVentasFiltradas(@Valid @ModelAttribute VentaQuery filtros) {
        return ventaService.obtenerVentasFiltradas(filtros);
    }

    @GetMapping("/ingresos-mes")
    public ResponseEntity<?> getIngresosMes() {
        Double total = ventaService.obtenerMetricasDashboard();
        return ResponseEntity.ok(Collections.singletonMap("total", total));
    }

    @GetMapping("/ingresos-semana")
    public ResponseEntity<List<VentaDiariaResponse>> getVentasMensuales() {
        return ResponseEntity.ok(ventaService.obtenerVentasMensuales());
    }
}
