package com.yourapp.app.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequestException extends AppException {
    public BadRequestException(String mensaje) {
        super(mensaje, HttpStatus.BAD_REQUEST);
    }
}
