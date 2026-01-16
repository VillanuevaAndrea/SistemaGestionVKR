package com.yourapp.app.models.dto.rol;

import java.util.List;

import com.yourapp.app.models.entities.Permiso;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RolCreateRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    private List<Permiso> permisos;
}
