package com.yourapp.app.middlewares;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.yourapp.app.exceptions.AppException;
import com.yourapp.app.models.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class AppExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(AppExceptionHandler.class);

    private ResponseEntity<ErrorResponse> crearErrorDto(String message, HttpStatus status, HttpServletRequest req) {
        logger.error("============= EXCEPCIÓN DETECTADA =============");
        logger.error("Status: {}", status.value());
        logger.error("Path: {}", req.getRequestURI());
        logger.error("Message: {}", message);
        logger.error("===============================================");

        ErrorResponse errorDto = new ErrorResponse(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            req.getRequestURI()
        );

        return ResponseEntity.status(status).body(errorDto);
    }

    @ExceptionHandler(org.springframework.security.authentication.InternalAuthenticationServiceException.class)
    public ResponseEntity<ErrorResponse> handleInternalAuth(org.springframework.security.authentication.InternalAuthenticationServiceException ex, HttpServletRequest req) {
        String mensaje = (ex.getCause() != null) ? ex.getCause().getMessage() : ex.getMessage();
        return crearErrorDto(mensaje, HttpStatus.UNAUTHORIZED, req);
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(org.springframework.security.core.AuthenticationException ex, HttpServletRequest req) {
        return crearErrorDto("Credenciales inválidas", HttpStatus.UNAUTHORIZED, req);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleApp(AppException ex, HttpServletRequest req) {
        return crearErrorDto(ex.getMessage(), ex.getStatus(), req);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValid(MethodArgumentNotValidException ex, HttpServletRequest req) {
        String mensaje = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();

        return crearErrorDto(mensaje, HttpStatus.BAD_REQUEST, req);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleRoute(NoResourceFoundException ex, HttpServletRequest req) {
        return crearErrorDto("La ruta solicitada no existe", HttpStatus.NOT_FOUND, req);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ErrorResponse> handleMethod(HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        String mensaje = String.format("El método %s no está permitido en esta ruta", ex.getMethod());
    
        return crearErrorDto(mensaje, HttpStatus.METHOD_NOT_ALLOWED, req);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        String mensaje = "Acceso denegado. No tiene los permisos necesarios.";
        
        return crearErrorDto(mensaje, HttpStatus.FORBIDDEN, req);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleReadableException(HttpMessageNotReadableException ex, HttpServletRequest req) {
        String mensaje = "Error en el formato del JSON";
            
        if (ex.getMessage() != null && ex.getMessage().contains("not one of the values accepted for Enum class")) {
            String detalle = ex.getMessage();
            int inicio = detalle.lastIndexOf("[");
            int fin = detalle.lastIndexOf("]");
            
            if (inicio != -1 && fin != -1) {
                String valores = detalle.substring(inicio, fin + 1);
                mensaje = "Valor inválido. Los valores permitidos son: " + valores;
            } else {
                mensaje = "El valor enviado no es válido para el tipo de dato requerido.";
            }
        }

        return crearErrorDto(mensaje, HttpStatus.BAD_REQUEST, req);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest req) {
        return crearErrorDto("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR, req);
    }
}