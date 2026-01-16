package com.yourapp.app.exceptions;

import org.springframework.http.HttpStatus;

public class ConflictException extends AppException {
    public ConflictException(String mensaje) {
        super(mensaje, HttpStatus.CONFLICT);
    }
}
