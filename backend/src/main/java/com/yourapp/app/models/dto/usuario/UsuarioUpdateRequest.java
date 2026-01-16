package com.yourapp.app.models.dto.usuario;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UsuarioUpdateRequest {
    @NotNull
    private Long rolId;
}
