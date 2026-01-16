package com.yourapp.app.models.dto.cliente;

import com.yourapp.app.models.entities.Cliente.CategoriaCliente;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ClienteResponse {
    private Long id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String dni;
    private Double creditoLimite;
    private Double deuda;
    private Double creditoDisponible;
    private CategoriaCliente categoriaCliente;
}