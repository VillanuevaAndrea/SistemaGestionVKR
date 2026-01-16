package com.yourapp.app.models.dto.rol;

import java.util.List;

import com.yourapp.app.models.entities.Permiso;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RolUpdateRequest {
    @NotEmpty(message = "Debes asignar al menos un permiso al rol")
    private List<Permiso> permisos;
}
