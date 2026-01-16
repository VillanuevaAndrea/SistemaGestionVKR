package com.yourapp.app.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends AppException{
    public NotFoundException(String mensaje) {
        super(mensaje, HttpStatus.NOT_FOUND);
    }
}
