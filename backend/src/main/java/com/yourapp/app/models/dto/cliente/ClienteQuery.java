package com.yourapp.app.models.dto.cliente;

import com.yourapp.app.models.entities.Cliente.CategoriaCliente;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ClienteQuery {
    private String nombre;
    private String apellido;
    private String dni;
    private CategoriaCliente categoria;
    private String orden;
    private String direccion;
    private Integer pagina;
}
