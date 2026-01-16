// package com.yourapp.app.helpers;

// import domain.modelo.entities.Entidades.Miembro.Miembro;
// import domain.modelo.entities.Entidades.Organizacion.Organizacion;
// import domain.modelo.entities.Entidades.Usuario.Usuario;
// import domain.modelo.entities.SectorTerritorial.AgenteSectorial;
// import domain.modelo.repositories.factories.FactoryRepositorioAgenteSectorial;
// import domain.modelo.repositories.factories.FactoryRepositorioMiembro;
// import domain.modelo.repositories.factories.FactoryRepositorioOrganizacion;
// import domain.modelo.repositories.factories.FactoryRepositorioUsuarios;
// import spark.Request;

// public class AccesoRecursosPropiosHelper {

//     public static boolean mismoMiembro(Request request) {
//         Miembro miembro = FactoryRepositorioMiembro.get()
//                 .buscarMiembroPorUsuario(request.session().attribute("id"));
//         return Integer.parseInt(request.params("id")) == miembro.getId();
//     }

//     public static boolean mismaOrganizacion(Request request) {
//         Organizacion organizacion = FactoryRepositorioOrganizacion.get()
//                 .buscarOrganizacionPorUsuario(request.session().attribute("id"));
//         return Integer.parseInt(request.params("id")) == organizacion.getId();
//     }

//     public static boolean mismoAdministrador(Request request) {
//         Usuario usuario = FactoryRepositorioUsuarios.get()
//                 .buscar(request.session().attribute("id"));
//         return Integer.parseInt(request.params("id")) == usuario.getId();
//     }

//     public static boolean mismoAgenteSectorial(Request request) {
//         AgenteSectorial agenteSectorial = FactoryRepositorioAgenteSectorial.get()
//                 .buscarAgentePorUsuario(request.session().attribute("id"));
//         return Integer.parseInt(request.params("id")) == agenteSectorial.getId();
//     }
// }
