# Assets Folder

Este directorio contiene los recursos estáticos utilizados en la aplicación.

## Estructura

- `images/`: Almacena todas las imágenes utilizadas en la aplicación

## Cómo usar

### Almacenar imágenes

1. Coloca tus archivos de imagen directamente en la carpeta `images/`
2. Para mejor organización, puedes crear subcarpetas dentro de `images/` para diferentes categorías (ej: `products/`, `banners/`, `icons/`)

### Referenciar imágenes en componentes HTML

Para usar una imagen en un componente HTML, utiliza la ruta relativa desde la raíz de la aplicación:

```html
<!-- Ejemplo básico -->
<img src="assets/images/nombre-imagen.jpg" alt="Descripción de la imagen">

<!-- Ejemplo con subcarpeta -->
<img src="assets/images/products/producto1.jpg" alt="Producto 1">
```

### Referenciar imágenes en CSS/SCSS

```css
.elemento {
  background-image: url('/assets/images/fondo.jpg');
}
```

### Referenciar imágenes en TypeScript

Si necesitas referenciar imágenes dinámicamente en TypeScript:

```typescript
export class MiComponente {
  imagePath = 'assets/images/producto.jpg';
}
```

Y en el template:

```html
<img [src]="imagePath" alt="Producto">
```

## Recomendaciones

- Utiliza formatos optimizados para web (WebP, PNG optimizado, JPEG comprimido)
- Nombra los archivos de manera descriptiva y consistente
- Considera usar nombres en inglés y sin espacios para evitar problemas de compatibilidad