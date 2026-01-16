package com.yourapp.app.models.entities.adapters;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class AdapterTwilio implements AdapterWhatsapp {
    @Value("${twilio.sid}")
    private String accountSid;

    @Value("${twilio.token}")
    private String authToken;

    @Value("${twilio.phoneNumber}")
    private String phoneNumber;

    @Override
    public void notificar(String mensaje, String contacto) {
        Twilio.init(accountSid, authToken);
        // NO MANDAR LOS NUMEROS CON + 
        Message.creator(
            new PhoneNumber("whatsapp:" + contacto),
            new PhoneNumber("whatsapp:" + phoneNumber),
            mensaje
        ).create();
    }
}
