package com.yourapp.app.models.dto.venta;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yourapp.app.models.dto.cliente.ClienteResponse;
import com.yourapp.app.models.dto.empleado.EmpleadoResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VentaResponse {
    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fecha;
    private EmpleadoResponse empleado;
    private ClienteResponse cliente;
    private Double total;
    private Double montoPagado;
    private Double saldoPendiente;
    private Double progresoPago;
    private Double pagoMinimoParaCredito;
    private String metodoPago;
    private String estadoNombre;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaVencimientoReserva;
    private List<PagoDeCreditoResponse> pagosCredito;
    private List<DetalleVentaResponse> detalles;
}
