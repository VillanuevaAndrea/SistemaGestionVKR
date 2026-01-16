package com.yourapp.app.models.dto.cliente;

import com.yourapp.app.models.entities.Cliente.CategoriaCliente;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ClienteCreateRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede superar los 100 caracteres")
    private String apellido;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9+()\\s-]{10,15}$", message = "El formato de teléfono es inválido. Debe contener entre 10 y 15 números")
    private String telefono;
    
    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{6,8}$", message = "El formato de DNI es inválido. Debe contener entre 6 y 8 dígitos")
    private String dni;

    @PositiveOrZero(message = "El límite de crédito no puede ser un valor negativo")
    private Double creditoLimite;

    private CategoriaCliente categoria;
}
