# TRABAJO PRÁCTICO DE DISEÑO DE SISTEMAS

## Backend (Java / Spring Boot)

### Requisitos
- **Java JDK 17** o superior  
  Descargar de: [Adoptium Temurin 17](https://adoptium.net/es/temurin/releases?version=17)  
- **Maven** incluido en el proyecto (wrapper `mvnw`)  

### Instalación de Java
1. Descomprimir el JDK en:
  `C:\Program Files (x86)\Java\jdk-17.0.16+8` 

2. Configurar variables de entorno:
  - Crear la variable de sistema JAVA_HOME apuntando al JDK `C:\Program Files (x86)\Java\jdk-17.0.16+8`
  - Agregar `%JAVA_HOME%\bin` al `PATH` de las variables del sistema

3. Verificar instalación:
- Abrir PowerShell o CMD y ejecutar:
  `java -version` y `javac -version`

### Ejecución del backend
- Abrir una terminal y moverse a la carpeta:
  `TP-DDS-VKR\backend`

- Primera ejecución (compila todo desde cero):
  `.\mvnw clean spring-boot:run`

- Ejecuciones posteriores:
  `.\mvnw spring-boot:run`
