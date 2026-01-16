// package com.yourapp.app.helpers;

// import spark.Request;

// import java.util.Map;

// public class AlertaHelper {
//     public static void agregarAlerta(Request request, Map<String, Object> parametros) {
//         if(request.session().attribute("mensaje") != null
//                 && request.session().attribute("danger") != null) {
//             parametros.put("mensaje", request.session().attribute("mensaje"));
//             parametros.put("danger", request.session().attribute("danger"));

//             request.session().removeAttribute("mensaje");
//             request.session().removeAttribute("danger");
//         }

//         if(request.session().attribute("mensaje") != null
//                 && request.session().attribute("succes") != null) {
//             parametros.put("mensaje", request.session().attribute("mensaje"));
//             parametros.put("succes", request.session().attribute("succes"));

//             request.session().removeAttribute("mensaje");
//             request.session().removeAttribute("succes");
//         }
//     }
// }
