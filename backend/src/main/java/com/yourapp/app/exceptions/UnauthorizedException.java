package com.yourapp.app.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends AppException {
    public UnauthorizedException(String mensaje) {
        super(mensaje, HttpStatus.UNAUTHORIZED);
    }
}
