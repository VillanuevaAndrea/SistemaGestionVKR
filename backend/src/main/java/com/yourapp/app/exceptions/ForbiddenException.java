package com.yourapp.app.exceptions;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends AppException {
    public ForbiddenException(String mensaje) {
        super(mensaje, HttpStatus.FORBIDDEN);
    }
}
