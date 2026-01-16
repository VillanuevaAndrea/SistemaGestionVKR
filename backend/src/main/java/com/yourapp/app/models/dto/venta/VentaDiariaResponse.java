package com.yourapp.app.models.dto.venta;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class VentaDiariaResponse {
    private String dia;
    private Double total;
}
