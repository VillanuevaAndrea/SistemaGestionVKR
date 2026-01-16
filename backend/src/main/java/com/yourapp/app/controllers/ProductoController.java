package com.yourapp.app.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.app.models.dto.producto.DetalleProductoCreateRequest;
import com.yourapp.app.models.dto.producto.DetalleProductoResponse;
import com.yourapp.app.models.dto.producto.DetalleProductoUpdateRequest;
import com.yourapp.app.models.dto.producto.DetalleProductoVentaResponse;
import com.yourapp.app.models.dto.producto.ProductoCreateRequest;
import com.yourapp.app.models.dto.producto.ProductoQuery;
import com.yourapp.app.models.dto.producto.ProductoResponse;
import com.yourapp.app.models.dto.producto.ProductoUpdateRequest;
import com.yourapp.app.services.ProductoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
public class ProductoController {
    private final ProductoService productoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PRODUCTO_CREAR')")
    public ProductoResponse crearProducto(@RequestBody @Valid ProductoCreateRequest productoDto) {
        return productoService.crearProducto(productoDto);
    }

    @PostMapping("/{id}/detalles")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PRODUCTO_CREAR')")
    public DetalleProductoResponse crearDetalleProducto(@PathVariable Long id, @RequestBody @Valid DetalleProductoCreateRequest detalleDto) {
        return productoService.crearDetalleProducto(id, detalleDto);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PRODUCTO_VER')")
    public ProductoResponse obtenerProducto(@PathVariable Long id) {
        return productoService.obtenerProducto(id);
    }

    @GetMapping("/detalles/{codigo}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PRODUCTO_VER')")
    public DetalleProductoVentaResponse obtenerProductoByCodigo(@PathVariable String codigo) {
        return productoService.obtenerProductoByCodigo(codigo);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PRODUCTO_MODIFICAR')")
    public ProductoResponse actualizarProducto(@PathVariable Long id, @RequestBody @Valid ProductoUpdateRequest productoDto) {
        return productoService.actualizarProducto(id, productoDto);
    }

    @PatchMapping("/{id}/detalles/{detalleId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PRODUCTO_MODIFICAR')")
    public DetalleProductoResponse actualizarDetalleProducto(@PathVariable Long id, @PathVariable Long detalleId, @RequestBody @Valid DetalleProductoUpdateRequest detalleDto) {
        return productoService.actualizarDetalleProducto(id, detalleId, detalleDto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PRODUCTO_VER')")
    public Page<ProductoResponse> obtenerProductosFiltrados(@Valid @ModelAttribute ProductoQuery filtros) {
        return productoService.obtenerProductosFiltrados(filtros);
    } 

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('PRODUCTO_ELIMINAR')")
    public void eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }

    @PatchMapping("/{id}/detalles/{detalleId}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('PRODUCTO_ELIMINAR')")
    public void eliminarDetalleProducto(@PathVariable Long id, @PathVariable Long detalleId) {
        productoService.eliminarDetalleProducto(id, detalleId);
    }
}   
