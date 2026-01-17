##VKR - Sistema de Gestion de Ventas 

Sistema integral de gestión para tiendas físicas (VIKIARA) desarrollado con una arquitectura orientada al dominio. El sistema centraliza la administración de inventario complejo, ciclo de vida de ventas con crédito y fidelización de clientes.

🖼️ Interfaz del Sistema (Módulo de Productos)
La interfaz permite una gestión granular de existencias, soportando múltiples variantes por artículo.
Vista del catálogo: Búsqueda dinámica, filtros por categoría y gestión de variantes (talle/color) con control de stock mínimo.


🛠️ Arquitectura y Decisiones de Diseño
El sistema se diseñó priorizando el bajo acoplamiento y la escalabilidad funcional.

🔹 Gestión de Ventas y Reservas (Patrón State)
Se implementó el patrón State para gestionar el ciclo de vida de las ventas. Esto permite transiciones seguras entre estados como:
INICIADA → RESERVADA: Reservas exclusivas para clientes confiables mediante crédito.
RESERVADA → PAGADA: Soporte de pagos parciales hasta completar el total.
STOCK DINÁMICO: El inventario transiciona entre estados Disponible, Reservado y Confirmado para evitar sobreventas durante los 90 días de validez de una reserva.

🔹 Modelo de Dominio Normalizado
Productos: Separación de entidad Producto de sus atributos (Categoría, Subcategoría, Detalle) para facilitar reportes y mantener la consistencia de datos.
Clientes y Confianza: Sistema de reglas configurables por el dueño para clasificar clientes (Registrado, Confiable, No Confiable) y asignar límites de crédito.
Notificaciones (Patrón Strategy + Adapter): Desacoplamiento de proveedores externos (Gmail, Twilio) para envíos de alertas por Email o WhatsApp.

💻 Stack Tecnológico

Backend: Java 17 con Spring Boot (Spring Web, Data JPA, Security).
Base de Datos: PostgreSQL para asegurar transacciones ACID en un dominio relacional complejo.
Frontend: SPA moderna desarrollada en React + TypeScript enfocada en la usabilidad.
Integraciones: API de Mercado Pago (QR), Twilio (WhatsApp) y Gmail (Email) mediante adaptadores.


📈 Características Principales
RBAC (Role-Based Access Control): Separación estricta de responsabilidades entre dueños y empleados.
Soft Delete: Mantenimiento de integridad referencial y trazabilidad histórica.
Gestión de Cambios: Proceso automatizado de devoluciones con generación de saldo a favor o cobro de diferencias.
