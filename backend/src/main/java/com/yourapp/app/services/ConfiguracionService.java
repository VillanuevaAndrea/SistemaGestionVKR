package com.yourapp.app.services;

import com.yourapp.app.exceptions.NotFoundException;
import com.yourapp.app.mappers.ConfiguracionMapper;
import com.yourapp.app.models.dto.configuracion.ConfiguracionResponse;
import com.yourapp.app.models.dto.configuracion.ConfiguracionUpdateRequest;
import com.yourapp.app.models.entities.ConfiguracionTienda;
import com.yourapp.app.repositories.ConfiguracionTiendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConfiguracionService {
  private final ConfiguracionTiendaRepository configuracionTiendaRepository;
  private final ConfiguracionMapper configuracionMapper;

  @EventListener(ApplicationReadyEvent.class)
  @Transactional
  public void inicializarConfiguracion() {
  
    ConfiguracionTienda config = configuracionTiendaRepository.findFirstByOrderByIdAsc()
        .orElseGet(() -> {
          ConfiguracionTienda nuevaConfig = new ConfiguracionTienda();
          nuevaConfig.setNombreEmpresa("Mi Tienda");
          nuevaConfig.setPermiteReserva(true);
          nuevaConfig.setPorcentajeMinimoSena(0.10);
          nuevaConfig.setDiasValidezReserva(90);
          nuevaConfig.setStockMinimoGlobal(5);
          nuevaConfig.setDiasMaximoCancelacion(60);
          return configuracionTiendaRepository.save(nuevaConfig);
        });

    
    ConfiguracionTienda.setInstance(config);

    System.out.println("Configuración de tienda cargada: " + config.getNombreEmpresa());
  }

  @Transactional
  public ConfiguracionResponse actualizarConfiguracion(ConfiguracionUpdateRequest dto) {
    ConfiguracionTienda configActual = configuracionTiendaRepository.findFirstByOrderByIdAsc().orElseThrow(() -> new NotFoundException("No se encontró la configuración"));
    configuracionMapper.updateEntity(dto, configActual);
    ConfiguracionTienda guardada = configuracionTiendaRepository.save(configActual);
    ConfiguracionTienda.setInstance(guardada);
    
    return configuracionMapper.toResponse(guardada);
  }

  public ConfiguracionResponse obtenerConfiguracionActual() {
    return configuracionMapper.toResponse(ConfiguracionTienda.getInstance());
  }
}
