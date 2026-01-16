package com.yourapp.app.models.dto.producto;

import java.util.List;

import com.yourapp.app.models.dto.proveedor.ProveedorResponse;
import com.yourapp.app.models.dto.subcategoria.SubcategoriaDetalleResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private SubcategoriaDetalleResponse subcategoria;
    private ProveedorResponse proveedor;
    private Integer precio;
    private Integer stockTotal;
    private List<DetalleProductoResponse> detalles;
}
