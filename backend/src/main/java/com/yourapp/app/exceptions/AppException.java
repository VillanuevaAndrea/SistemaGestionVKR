package com.yourapp.app.exceptions;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public abstract class AppException extends RuntimeException {
    private final HttpStatus status;

    public AppException(String mensaje, HttpStatus status) {
        super(mensaje);
        this.status = status;
    }
}
