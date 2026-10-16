# Durísima – landing

Landing de una sola página para Durísima (la app de equipo, reservas, web y redes). HTML, CSS y JS sin build.

- `index.html`, `css/landing.css`, `js/landing.js`: la página y sus demos interactivas.
- `vendor/gsap-3.13.0/`: GSAP y ScrollTrigger, autoalojados (si no cargan, la página se ve igual, sin las animaciones de scroll).
- `media/`: el anuncio en 3 versiones (720p, 480p para móvil y una desenfocada de fondo) y sus pósteres. El original (`media/src/`) no se sube a git.
- `fonts/`: Anton, Inter y DM Mono, autoalojadas.
- `PLAN-REDISENO.md`: el plan con el que se hizo el rediseño.

## Probarla en local

```bash
npx serve@14 -l 5800 .
```

Hace falta un servidor que admita peticiones Range (como `serve`) para que el vídeo pueda saltar de capítulo.

## Volver a sacar el vídeo

Con ffmpeg y el `anuncio.mp4` original en `media/src/anuncio.mp4`, los comandos están en la fase 2 de `PLAN-REDISENO.md`.
