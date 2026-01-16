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

import com.yourapp.app.models.dto.cliente.ClienteCreateRequest;
import com.yourapp.app.models.dto.cliente.ClienteQuery;
import com.yourapp.app.models.dto.cliente.ClienteResponse;
import com.yourapp.app.models.dto.cliente.ClienteUpdateRequest;
import com.yourapp.app.services.ClienteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {
    private final ClienteService clienteService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('CLIENTE_CREAR')")
    public ClienteResponse crearCliente(@RequestBody @Valid ClienteCreateRequest clienteDto) {
        return clienteService.crearCliente(clienteDto);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK) 
    @PreAuthorize("hasAuthority('CLIENTE_VER')")
    public ClienteResponse obtenerCliente(@PathVariable Long id) {
        return clienteService.obtenerCliente(id);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('CLIENTE_MODIFICAR')")
    public ClienteResponse actualizarCliente(@PathVariable Long id, @RequestBody @Valid ClienteUpdateRequest clienteDto) {
        return clienteService.actualizarCliente(id, clienteDto);
    }

    @PatchMapping("/{id}/eliminacion")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('CLIENTE_ELIMINAR')")
    public void eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('CLIENTE_VER')")
    public Page<ClienteResponse> obtenerClientesFiltrados(@Valid @ModelAttribute ClienteQuery filtros) {
        return clienteService.obtenerClientesFiltrados(filtros);
    }
}
