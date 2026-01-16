package com.yourapp.app.models.dto.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmpleadoCreateRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede superar los 100 caracteres")
    private String apellido;
    
    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{6,8}$", message = "El formato de DNI es inválido. Debe contener entre 6 y 8 dígitos")
    private String dni;
    
    @Size(max = 255, message = "La dirección no puede superar los 255 caracteres")
    private String direccion;
    
    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El formato de la dirección de correo electrónico es inválido")
    private String mail;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9+()\\s-]{10,15}$", message = "El formato de teléfono es inválido. Debe contener entre 10 y 15 números")
    private String telefono;
    
    @NotNull(message = "Debes asignar un rol al empleado")
    @Positive(message = "El ID de rol debe ser un valor válido")
    private Long rolId;
}
