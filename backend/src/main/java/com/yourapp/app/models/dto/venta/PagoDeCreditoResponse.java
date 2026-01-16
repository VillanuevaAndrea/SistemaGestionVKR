package com.yourapp.app.models.dto.venta;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PagoDeCreditoResponse {
    private Long id;
    private Double monto;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fecha;
    private Integer numeroPago;
}
