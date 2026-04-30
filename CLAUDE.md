@AGENTS.md

# Proyecto "C Minds" - Registro y Reglas del Entorno

Este documento captura todas las decisiones de arquitectura, estilo y dependencias que hemos establecido en este proyecto. Funciona como una guía inmutable de lo aprendido y configurado hasta el momento.

## 🛠 Pila Tecnológica Central
- **Core Framework:** Next.js (App Router estructural).
- **Estilos:** Vanilla CSS (`globals.css`). **NOTA:** De forma explícita restringimos el uso de TailwindCSS para tener el mayor control sobre tokens de estética visual moderna.
- **Animaciones:** GSAP + `@gsap/react`. Herramienta principal para coordinar transiciones de texto (entradas "blur focus") y movimientos abstractos en SVG.
- **Componentes Extra:** 
  - Listo y abierto para la inyección de **ReactBits**.
  - Efectos visuales de refracción controlados por el HOC y componentes de **`@hashintel/refractive`**.

## 🎨 Lineamientos de Diseño Premium (Design System)

### Colores
- **Fondo Global (Background):** `#040314` (Tonos muy profundos de la noche para generar contraste oscuro)
- **Acento (Primary Glow):** `#5EC1F3` (Se utiliza para elementos activos, gradientes focales o brillos ambientales)
- **Texto Atenuado (Dim Text):** `#8b929b` (Para dar respiro a palabras de apoyo, "to", "a", etc.)

### Tipografía
- **Satoshi (.otf)** inyectada de forma nativa.
- Configurada usando la optimización del ecosistema de Next.js mediante `next/font/local` en el `Layout` principal.
- Esto elimina saltos de tipografía y descarta a Google Fonts (`Inter`), asegurando este estilo sobrio y pulido a nivel mundial.

### Patrones de Interfaz Construidos
1. **Glassmorphism Dinámico (Refractivo):** Empleado usando `<refractive.div radius={20} blur={15} bezelWidth={8}>` para envolver "Menús o Tarjetas" que se pongan por delante de un elemento en movimiento.
2. **Iluminación Abierta (Glows):** El entorno gana vida inyectando gradientes radiales al fondo (`radial-gradient`) de la pantalla con un blur general súper alto (`blur(80px)`). 
3. **Efecto de Transición Blur-in:** Todo el hero text de "C Minds" entra cargado por GSAP con `filter: blur(12px) -> 0` y `stagger`.
4. **Botones Píldora (Gradient Borders):** Se fabrican utilizando `backdrop-filter: blur()`, un control estricto de bordes con opacidad (`rgba(255,255,255, 0.1)`) y falsos llenados degradados con seudo elementos (`::before`).

## 📋 Reglas al crear nuevos componentes
1. Respetar el flujo de CSS global: Añade los estilos a `globals.css` u hojas modulares locales. Evitando estilos inline donde se requiera complejidad.
2. Para cualquier animación DOM, encapsular siempre usando el contexto estable de `useGSAP( ... , {scope: myRef})`.
3. Mantener el diseño "Premium y Limpio", lo que significa prescindir de paletas de tres colores obvios, y enfocarse en una iluminación ambiental basada siempre en el azul principal `#5EC1F3` o variaciones oscuras y elegantes.
4. **Integración de WebGL/Three.js (ReactBits):** Al incluir lógicas de Canvas o Shaders brutos, debes proveer interfaces TypeScript estrictas (`LaserFlowProps`) y asegurar que los hooks de React no deduzcan "any" (`HTMLDivElement`, `WebGLRenderer`). Es vital un early-return si las ref no existen `if (!mount) return;`.

## 🧠 Técnicas de Animación Avanzadas
- **Animaciones Orbitales (Motion Paths):** En lugar de recurrir a GSAP `MotionPathPlugin` (que puede requerir licencias o plugins extras), al animar órbitas/objetos en trazos elípticos irregulares es mejor inyectar código SVG puro. Usar rutas ancladas dentro de `<defs><path id="miRuta"/></defs>` y agregar etiquetas `<animateMotion>` y `<mpath href="#miRuta">` embebidas directamente sobre el `<circle>`. Resulta una animación libre, modular y extremadamente eficiente renderizada en motor gráfico nativo del navegador.
