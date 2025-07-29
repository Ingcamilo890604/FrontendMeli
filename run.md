# Frontend Challenge - Documentación del Proyecto

Este documento proporciona información sobre las tecnologías utilizadas en este proyecto e instrucciones sobre cómo ejecutarlo.

## Tecnologías Utilizadas

### Framework Principal
- **Angular 20**: Una plataforma y framework para construir aplicaciones cliente de una sola página utilizando HTML y TypeScript.

### Lenguaje
- **TypeScript 5.8**: Un lenguaje de programación fuertemente tipado que se basa en JavaScript, proporcionando mejores herramientas a cualquier escala.

### Bibliotecas
- **RxJS 7.8**: Una biblioteca para programación reactiva utilizando Observables, para facilitar la composición de código asíncrono o basado en callbacks.
- **Zone.js**: Una biblioteca que proporciona una forma de conectarse a las operaciones asíncronas del navegador, utilizada por Angular para la detección de cambios.

### Arquitectura
La aplicación sigue una arquitectura en capas:
- **Componentes**: Bloques de construcción de la interfaz de usuario (resultados de búsqueda, detalle de producto, etc.)
- **Servicios**: Capa de lógica de negocio
- **Repositorios**: Capa de acceso a datos
- **Modelos**: Estructuras de datos
- **Fachadas**: Simplifican subsistemas complejos

### Características
- Búsqueda de productos con sugerencias en tiempo real
- Vista detallada de productos
- Productos relacionados
- Paginación
- Diseño responsivo

## Instrucciones de Configuración

### Requisitos Previos
- Node.js (v18 o superior recomendado)
- npm (v9 o superior recomendado)

### Instalación

1. Clonar el repositorio:
   ```
   git clone <repository-url>
   cd FrontendChallenge
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

## Ejecutando la Aplicación

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo:

```
npm start
```

Esto ejecutará la aplicación en modo de desarrollo. Abre tu navegador y navega a `http://localhost:4200/` para ver la aplicación.

La aplicación se recargará automáticamente si cambias cualquiera de los archivos fuente.

### Compilación para Producción

Para compilar la aplicación para producción:

```
npm run build
```

Esto creará una compilación lista para producción en el directorio `dist/demo`. Los artefactos de compilación estarán optimizados para el rendimiento.

## Estructura del Proyecto

- **src/app**: Módulo principal de la aplicación
- **src/assets**: Activos estáticos (imágenes, fuentes, etc.)
- **src/components**: Componentes de Angular
- **src/constants**: Constantes y configuración de la aplicación
- **src/facades**: Implementaciones del patrón Fachada
- **src/models**: Modelos/interfaces de datos
- **src/pages**: Componentes de página
- **src/repositories**: Capa de acceso a datos
- **src/services**: Servicios de lógica de negocio y procesamiento de datos

## Rutas Principales

- `/search`: Página de resultados de búsqueda (predeterminada)
- `/product/:id`: Página de detalle de producto

## Información Adicional

### Integración con API
La aplicación se comunica con una API backend a través del `ProductHttpRepository`. La URL base de la API y los endpoints están configurados en el archivo de constantes.

### Manejo de Errores
La aplicación incluye un manejo integral de errores con alternativas para garantizar una buena experiencia de usuario incluso cuando la API falla.

### Prácticas de Desarrollo
- Programación reactiva con RxJS
- Carga perezosa para mejor rendimiento
- Componentes independientes
- Inyección de dependencias para mejor capacidad de prueba
- Clases abstractas para la implementación del patrón repositorio