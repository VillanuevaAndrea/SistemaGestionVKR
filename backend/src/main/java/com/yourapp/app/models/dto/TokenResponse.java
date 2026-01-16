package com.yourapp.app.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    @JsonProperty("token")
    String token;
}
