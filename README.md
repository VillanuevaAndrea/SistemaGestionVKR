## VKR - Sistema de Gestion de Ventas 

VKR es una solución integral de gestión diseñada para la tienda física VIKIARA. El sistema no solo administra productos, sino que resuelve el problema crítico del negocio: la gestión de ventas reservadas mediante crédito exclusivo y la trazabilidad de pagos parciales.
A diferencia de un e-commerce tradicional, este sistema gestiona un flujo complejo de estados para garantizar que el stock y el crédito del cliente estén siempre sincronizados.

# Gestión de Estados (Patrón State)

Se implementó el patrón State para controlar las transiciones válidas de una venta:
INICIADA: Venta creada, pendiente de pago total o definición de reserva.
RESERVADA: Estado exclusivo para clientes con crédito; permite pagos parciales durante un período de hasta 90 días.
PAGADA: Venta finalizada tras recibir el pago total.
CANCELADA/RECHAZADA: Gestión automática de liberación de stock si la reserva vence o el crédito es insuficiente.

# Interfaz Operativa

La interfaz permite al empleado ejecutar "Nuevas Ventas" de forma ágil, visualizando en tiempo real el stock disponible, reservado y confirmado.

# Decisiones de Diseño Críticas

# Sistema de Crédito y Confiabilidad
Segmentación de Clientes: Los clientes se clasifican en Registrados, Confiables o No Confiables mediante reglas configurables por el dueño.
Reservas Exclusivas: Solo clientes "Confiables" pueden iniciar ventas en estado RESERVADA.
Saldo a Favor: Gestión automatizada de saldos positivos en caso de cambios por productos de menor valor.

# Control de Inventario 

Para soportar las reservas de larga duración (90 días), el stock se maneja en tres niveles:
Disponible: Listo para venta inmediata.
Reservado: Comprometido en una venta con pagos parciales en curso.
Confirmado: Vendido definitivamente tras completar el pago total.

# Notificaciones Inteligentes (Strategy + Adapter)

El sistema dispara alertas de Stock Bajo y recordatorios de Vencimiento de Reservas a través de múltiples canales (Email/WhatsApp) configurables, sin acoplar la lógica de negocio a los proveedores externos.

# Funcionalidades Clave

Gestión de Cambios y Devoluciones: Proceso que permite cancelar ventas pagadas y generar saldos a favor o cobros de diferencia de forma automática.
RBAC (Seguridad): Separación de permisos entre Dueños y Empleados para proteger la configuración de reglas de crédito.
Pagos QR: Integración con API de Mercado Pago para agilizar el cierre de ventas.

# Stack Tecnológico

Backend: Java 17 con Spring Boot. Se utiliza Spring Data JPA para el acceso a datos y Spring Security para la protección de recursos según roles.
Arquitectura: Diseño basado en arquitectura de capas (API/Controller, Business/Service, Data/Repository). Se utiliza un modelo de dominio donde la lógica de negocio reside en las entidades, apoyado por DTOs para la transferencia de datos y patrones como State para el ciclo de vida de la venta.
Base de Datos: PostgreSQL. Se eligió por su robustez para manejar relaciones complejas y garantizar transacciones ACID, asegurando que los pagos impacten correctamente en el stock y el crédito.
Frontend: Aplicación web desarrollada con React + TypeScript. La interfaz ofrece una experiencia de usuario fluida, interactuando con el backend mediante APIs REST (JSON).


