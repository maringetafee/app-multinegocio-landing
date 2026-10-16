# Plan: rediseño de la landing → marca «Durísima» con el anuncio dentro

Pensado para ejecutarlo con **Sonnet 5.5**, fase a fase. Cada fase termina con un commit y una comprobación en el navegador. No pases a la siguiente si la anterior no cumple su «Hecho cuando».

## 0. Contexto (léelo antes de tocar nada)

- **Repo:** `C:\Users\mario\Projects\app-multinegocio-landing`. Es una landing estática de un solo archivo: `index.html` (unos 94 KB, con CSS, HTML y JS inline y sin dependencias), `fonts/` y `netlify.toml`. Netlify publica la raíz.
- **La app que vende:** `C:\Users\mario\Projects\app-multinegocio` (Expo). Los colores reales están en `src/lib/theme.ts` y las condiciones de los planes en `PASOS.md:97`: Gratis hasta 3 locales y sin IA; prueba de Premium de 14 días; Premium con locales sin límite, 50 usos de IA al mes y 1.000 reservas al mes. **Los textos de la landing deben seguir esas condiciones.**
- **El anuncio:** `C:\Users\mario\Downloads\anuncio.mp4`, en vertical (1080×1920), 30 fps, 40,1 s, **sin audio** y de 20 MB. Su código fuente es `C:\Users\mario\Projects\NOMBRE_APP\marketing\anuncio\anuncio.html` (GSAP 3.12.5, fuentes Anton + Inter). **Es solo lectura: no se modifica nada en NOMBRE_APP.** Sirve como referencia de estilo y de efectos.
- **Decisión del usuario:** el vídeo se usa tal cual, así que **la landing pasa a llamarse «Durísima»**.
- **Hay que conservar:** todas las demos interactivas actuales (PIN, cuadrante con IA, reservas, mi web, registro, costes, varios negocios, tabla de planes y FAQ). Se les cambia el aspecto, **no la lógica**. El sistema de revelado actual (`.rv`, `[data-split]` e `IntersectionObserver`) y `prefers-reduced-motion` funcionan bien: se amplían y no se sustituyen.

### Reglas fijas
- **No hacer `netlify deploy`** ni push sin preguntar al usuario: gasta créditos.
- Trabaja en la rama `rediseno-durisima`. Haz un commit por fase, con el pie de commit que indique el sistema.
- Escribe en español de España. El tono de los textos debe ser cercano y sin tecnicismos, como ahora.
- El vídeo de 20 MB original **no se sube a git**.

---

## Fase 1. Preparación (sin cambios visibles)

1. `git checkout -b rediseno-durisima`
2. Separa el archivo **sin cambiar nada de comportamiento**:
   - El bloque `<style>` pasa a `css/landing.css`, enlazado con `<link rel="stylesheet">`.
   - El `<script>` grande del final pasa a `js/landing.js`, enlazado con `<script src="js/landing.js" defer>` en el `<head>`.
   - El script inline de una línea, `document.documentElement.classList.add('js')`, **se queda inline** al principio del `<body>`.
   - Las rutas de `@font-face` pasan a `../fonts/...`.
3. Crea `.claude/launch.json` con un servidor que **admita peticiones Range**, porque sin ellas Chrome no puede saltar a un punto del vídeo. `python -m http.server` no las admite.
   ```json
   {"version":"0.0.1","configurations":[{"name":"landing","runtimeExecutable":"npx","runtimeArgs":["--yes","serve@14","-l","5800","."],"port":5800}]}
   ```
4. Añade al `.gitignore` las rutas `media/src/` y `.netlify`.

**Hecho cuando:** `preview_start {name:"landing"}` muestra la landing idéntica a la de antes, sin errores en la consola, y la demo de PIN (1234) funciona.

---

## Fase 2. Preparar el vídeo (ffmpeg ya está instalado)

Copia el original a `media/src/anuncio.mp4`. Esa carpeta está en el `.gitignore`. Después genera estas versiones:

```bash
SRC=media/src/anuncio.mp4
# Principal: nítida, para la tarjeta del hero (debería pesar unos 4-6 MB)
ffmpeg -y -i $SRC -an -vf "scale=720:1280:flags=lanczos,format=yuv420p" -c:v libx264 -profile:v high -preset slow -crf 26 -g 30 -movflags +faststart media/anuncio-720.mp4
# Ligera: para móvil o datos lentos (unos 2 MB)
ffmpeg -y -i $SRC -an -vf "scale=480:854:flags=lanczos,format=yuv420p" -c:v libx264 -profile:v high -preset slow -crf 28 -g 30 -movflags +faststart media/anuncio-480.mp4
# Ambiente: diminuta y desenfocada, para el fondo a pantalla completa (unos 300 KB). El desenfoque va horneado: nada de filter:blur en CSS
ffmpeg -y -i $SRC -an -vf "scale=90:160,boxblur=6:2,scale=180:320,format=yuv420p" -r 15 -c:v libx264 -crf 30 -movflags +faststart media/anuncio-ambiente.mp4
# Pósteres: segundo 7,4 («Quién está») para la tarjeta y segundo 1 para el ambiente
ffmpeg -y -ss 7.4 -i $SRC -frames:v 1 -vf scale=720:-1 -c:v libwebp -quality 78 media/anuncio-poster.webp
ffmpeg -y -ss 1 -i $SRC -frames:v 1 -vf "scale=90:160,boxblur=6:2,scale=180:320" -c:v libwebp -quality 60 media/anuncio-ambiente.webp
```
Con `-g 30` hay un fotograma clave por segundo, así que los saltos por capítulo son instantáneos.

**Capítulos.** Estos tiempos salen de la línea de tiempo de `anuncio.html`. Compruébalos sacando fotogramas cada 0,5 s alrededor de cada uno, por ejemplo con `ffmpeg -ss 21 -i $SRC -vf fps=2,scale=160:-1,tile=8x1 -frames:v 1 x.jpg`:

| s | Capítulo | Sección de la landing |
|---|---|---|
| 0 | Basta de WhatsApp y Excel | `.old` |
| 5,6 | Tu equipo en directo | `#dia` |
| 9,8 | Fichan con su PIN | `#fichaje` |
| 13,7 | El cuadrante con IA | `#cuadrante` |
| 18,45 | Vacaciones y ausencias | `#dia` |
| ~21,5 | Para cualquier negocio | `#negocios` |
| 25,78 | Reservas y citas 24 h | `#reservas` |
| 28,2 | Tu web con dominio propio | `#web` |
| 30,78 | Tus redes | `#planes` (extra) |
| ~33 | Todo incluido | `#planes` |
| ~36 | Durísima | `.cta` |

Guárdalos en `js/landing.js` como `const CAPS=[[0,'Basta de WhatsApp','old'],…]`.

**Hecho cuando:** existen los 5 archivos de `media/`, suman menos de 9 MB y la tabla tiene los tiempos verificados.

---

## Fase 3. Marca y sistema visual nuevo

La dirección es **el anuncio, pero en vivo**: tipografía condensada y gritona, bloques de color saturado que cortan la pantalla, teléfonos con la interfaz clara real de la app, líneas de velocidad y ráfagas de partículas. Se deja la paleta crema, ciruela y rosa actual, porque no se parece ni a la app ni al anuncio.

### Fuentes (autoalojadas, como ahora)
Usa **Anton** para los titulares, siempre en MAYÚSCULAS, e **Inter** variable (400 a 900) para el cuerpo y las interfaces. Las dos son las del anuncio. Descarga los woff2 del subconjunto latin, que ya incluye Í, Ñ, ¿ y ¡: pide el CSS de `https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400..900&display=swap` con un User-Agent de Chrome, coge las URL `latin` y guárdalas en `fonts/anton-latin.woff2` y `fonts/inter-latin.woff2`. Precarga las dos y crea una fuente de respaldo con `size-adjust`, como la `Archivo Fallback` actual, para que no haya saltos de maquetación. Se puede conservar DM Mono para las etiquetas pequeñas. Archivo e Instrument Sans se borran.

### Tokens (en `:root`, sustituyendo a los actuales)
```css
--ink:#111111; --paper:#fafafa; --card:#ffffff; --sunken:#f3f3f3; --line:#e7e7e7; --muted:#6b6b6b;
--naranja:#ea580c; --azul:#2563eb; --rojo:#dc2626; --verde:#16a34a; --violeta:#7c3aed; --rosa:#db2777; --acento:#5b5bf0;
--f-d:'Anton','Anton Fallback',Impact,sans-serif; --f-b:'Inter','Inter Fallback',system-ui,sans-serif;
--ease:cubic-bezier(.22,1,.36,1); --ease-slam:cubic-bezier(.16,1,.3,1);
```
Son exactamente los colores que usa el anuncio en `bgCut`, `wipe` y `cap` y los de `theme.ts` de la app.

### Reglas de estilo
- **Titulares** (`.display` y `.h2`) en Anton mayúsculas, con interlineado de 0,9 a 0,95 y espaciado de 0 a -0,01 em. La palabra destacada (`em`) va en una **etiqueta de color**: un bloque sólido con texto blanco, o negro sobre blanco, girado ±1,5°, igual que «EN DIRECTO» o «SE HACE SOLO» en el anuncio.
- **Secciones** con fondos a sangre que se alternan: blanco `--paper`, negro `--ink`, naranja, azul, violeta y verde. En una sección de color el texto va en blanco. Se mantienen los bordes duros de 2 px y las sombras desplazadas (`4px 4px 0`) en tarjetas y botones, porque encajan con el anuncio.
- **Botones:** el principal es una píldora negra con texto blanco y el secundario una píldora con borde, como «Muy pronto» y «iOS y Android». Sobre fondo negro se invierten.
- **Teléfonos de las demos:** cambia el tema oscuro ciruela (`--night*`) por la **interfaz clara de la app**: pantalla blanca, fondo `#f2f2f7`, acento `#5b5bf0`, marco negro y muesca (mira `scrHoy()` y `scrPin()` en `anuncio.html`). Los colores de los avatares y los turnos salen de `theme.ts` (`local1`… `local5`, `vacaciones`, `baja`).
- **Logo:** un cuadrado negro de esquinas redondeadas con una «D» blanca en Anton, como en el anuncio. Úsalo en la navegación, el pie y el favicon (SVG inline en data URI).

### Cambio de marca (todo el archivo)
- Cambia «App Multinegocio» por «**Durísima**» en `<title>`, `description`, `og:*`, la navegación, el pie, el texto del enlace de WhatsApp («Hola, quiero probar Durísima 14 días.») y el asunto del email. Pon `theme-color` a `#111111`.
- Eslogan, tal como aparece en el anuncio: «Tu equipo, tus reservas, tu web y tus redes. Todo en uno.»
- Se queda «Una app de MakeMyWeb · Getafe (Madrid)».
- **Condiciones:** se mantienen las de la app (3 locales gratis, 14 días de Premium sin tarjeta). No copies «Gratis hasta 10 empleados» del vídeo: eso está pendiente del usuario (ver Riesgos).
- La llamada final mezcla las dos cosas: «En App Store y Google Play muy pronto. Mientras, pruébala 14 días gratis: te damos acceso por WhatsApp.»

**Hecho cuando:** toda la landing usa la marca y los tokens nuevos, no queda ningún color de la paleta vieja (busca `#692580`, `#DB488E` y `--night`), y las demos siguen funcionando.

---

## Fase 4. El hero con el vídeo

### Estructura
```
<section class="hero">
  <video class="hero__amb" …anuncio-ambiente.mp4…>   ← fondo a sangre, desenfocado, con capa oscura encima
  <div class="rays">                                ← líneas de velocidad (CSS) detrás de la tarjeta
  .wrap.hero__grid
     izquierda: titular + entradilla + botones + letra pequeña
     derecha:  .story  (tarjeta 9:16 con el vídeo nítido)
                 ├ <video class="story__v" poster=anuncio-poster.webp>
                 ├ barra de progreso por capítulos (clicable)
                 ├ botón de pausa/reproducción (obligatorio: WCAG 2.2.2)
                 ├ botón «Ver el anuncio entero» → <dialog> con <video controls>
                 └ píldoras flotantes (las cuatro actuales, adaptadas)
```
- **Escritorio (960 px o más):** dos columnas. La tarjeta mide `height:min(76vh,720px)` con `aspect-ratio:9/16`, va girada -3° con una sombra dura `8px 8px 0 var(--ink)` y lleva un borde blanco grueso, como una story.
- **Móvil (menos de 960 px):** primero el titular y los botones, y debajo la tarjeta a `width:min(78vw,360px)` centrada. **El vídeo no va de fondo detrás del titular**, porque sus propios textos gigantes chocarían con él. El vídeo de ambiente sí va de fondo.
- **Titular:** «TODO TU NEGOCIO **EN UNA APP.**», con «EN UNA APP.» en una etiqueta naranja.
- La **tarjeta de fichar** que hay ahora en el hero (`.pcard`, `#stampBtn`) **se traslada** a la sección `.old` («Cosas que ya puedes tirar»), a la derecha de la lista tachada. Su JS sigue igual.

### Lógica del vídeo (en `js/landing.js`)
- `muted playsinline loop preload="none"`, con `disablepictureinpicture` en el de ambiente y `aria-hidden="true"` en el de ambiente.
- **Carga diferida:** el `src` se asigna después del evento `load` más 300 ms. Así el LCP es el titular y no el vídeo.
- **Qué versión cargar:** `anuncio-480.mp4` si `innerWidth < 600`, si `navigator.connection?.saveData` o si `effectiveType` es 2g o 3g. En los demás casos, `anuncio-720.mp4`.
- **Sin reproducción automática** cuando hay `prefers-reduced-motion` o Save-Data. En ese caso se ve el póster con un botón grande de reproducir.
- **Pausa** cuando el hero sale de pantalla (ya existe un observer `.hero--off`: amplíalo) y cuando `document.hidden`. Si `play()` falla (algunos modos de ahorro de iOS), se muestra el póster con el botón de reproducir y no se lanza ningún error.
- **Capítulos sincronizados:** en `timeupdate`, el capítulo activo se marca en la barra y la píldora inferior muestra su nombre con una animación de cambio. Al hacer clic en un tramo, el vídeo salta a ese tiempo (`currentTime`).
- El vídeo de ambiente sigue al principal: los dos se ponen en marcha y se pausan juntos, y no hace falta sincronizarlos al fotograma.
- **Accesibilidad:** el vídeo nítido lleva `aria-label="Anuncio de Durísima, 40 segundos, sin sonido"` y un `<p class="sr-only">` con el resumen de capítulos.

**Hecho cuando:** en la vista previa el vídeo arranca solo después de cargar la página, la barra avanza, un clic en «Reservas» salta a 25,8 s, la pausa funciona, el diálogo abre el vídeo entero, y en móvil (375×812) no hay scroll horizontal y el titular se lee sin solaparse.

---

## Fase 5. Capa de animación (la parte de «muchas animaciones»)

Usa **GSAP 3.13.0 + ScrollTrigger** autoalojados en `vendor/gsap-3.13.0/`. Desde la 3.13 todo GSAP es gratis, plugins incluidos. Descárgalos de `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js` y `…/ScrollTrigger.min.js` y cárgalos con `defer` antes de `landing.js`. **Si GSAP no carga, la página debe verse entera y funcionar**: comprueba `if(window.gsap)` y deja el revelado por CSS y `IntersectionObserver` como base.

Reutiliza las funciones del anuncio (`cap`, `wipe`, `speed`, `burst`, `shake`, `flash`, en `anuncio.html`, líneas 610-680), adaptadas a scroll en lugar de a una línea de tiempo fija.

| # | Dónde | Animación | Cómo |
|---|---|---|---|
| 1 | Hero (al cargar) | Las palabras del titular **caen de golpe** desde scale 2,8 con blur de 16 px y un giro aleatorio de ±7° hasta su sitio, una tras otra. Después la etiqueta de color se dibuja de izquierda a derecha. | GSAP timeline, `expo.out`, stagger de 0,06. La partición en palabras ya la hace `[data-split]`. |
| 2 | Hero | La **tarjeta del vídeo entra como el teléfono del anuncio**: `y:+120%, rotationX:50, rotation:-14, scale:.82` hasta su posición, en 1 s con `expo.out`. Después aparecen las píldoras con `back.out(2)`. | GSAP |
| 3 | Hero | **Líneas de velocidad** girando despacio detrás de la tarjeta. | CSS: `repeating-conic-gradient` blanco al 12 % con `mask: radial-gradient(transparent 30%, #000)` y `@keyframes` de rotación de 60 s. |
| 4 | Todos los `.h2` | El mismo **golpe de palabras** del punto 1, pero al entrar en pantalla. | Solo CSS: cambia `.js [data-split] .w` a `opacity:0;transform:scale(2.2) rotate(var(--r));filter:blur(10px)`. JS pone un `--r` aleatorio a cada palabra. Sin GSAP. |
| 5 | Al entrar en cada sección de color | **Cortinilla de color** como el `wipe()` del anuncio: una capa del color de la sección barre la pantalla de izquierda a derecha y se retira. Una sola vez por sección. | ScrollTrigger `onEnter` + `clip-path: inset()` |
| 6 | `.old` | Burbujas de WhatsApp («¿Me cambias el turno del sábado?», «¿Quién abre el domingo?», «Mañana no puedo ir 😩») que **entran volando** y se apilan. Después, «**¡BASTA!**» cae de golpe con `shake()` y `flash()`, las burbujas salen disparadas hacia fuera y empiezan los tachados actuales. | Timeline de GSAP con ScrollTrigger (`start:"top 70%"`). Textos copiados del anuncio, escena 1. |
| 7 | Entre `#negocios` y `#planes` | **Muro de palabras** como el del final del anuncio: 5 filas de Anton gigante (unos 12vw) que alternan relleno blanco, contorno (`-webkit-text-stroke`) y verde, separadas por ✦, en marquesina con filas en sentidos opuestos. **La velocidad se acelera con la velocidad del scroll.** Palabras: FICHAR, CUADRANTE, VACACIONES, RESERVAS, GESTORÍA, AVISOS, COSTE DE PERSONAL, VARIOS LOCALES, REDES EN AUTOMÁTICO, DOMINIO PROPIO, PIN PARA FICHAR, CUBRIR HUECOS. | CSS `@keyframes` para la marquesina y JS que ajusta `animation.playbackRate` (Web Animations API) con `ScrollTrigger.getVelocity()`. Fondo negro. |
| 8 | Teléfonos de las demos | Entran con **inclinación 3D** (`rotationX:35 → 0` y `y:80 → 0`) y luego un **parallax** suave (`y: 30 → -30`, `scrub:true`). | ScrollTrigger |
| 9 | Momentos de acierto | **Ráfaga de partículas** (`burst()` del anuncio) al fichar bien, al enviar una reserva, al publicar el cuadrante y al publicar la web. | Función vanilla con Web Animations API, unas 24 partículas con los colores de la marca, que se borran solas. Hay que llamarla desde los manejadores ya existentes. |
| 10 | Números `.kick b` («01», «02»…) | **Contador rodante** de 00 al número al entrar. | Reutiliza `countTo()`. |
| 11 | `#dia` (la lista de horas) | Cada fila entra desde la izquierda en cascada, y la hora hace el golpe del punto 4. Al pasar el ratón, la fila se rellena de un color de la marca, como ahora con la lima. | Stagger de ScrollTrigger |
| 12 | Navegación | Se esconde al bajar y aparece al subir. El fondo es sólido, **sin `backdrop-filter`**, que en otros proyectos ha dado fallos de pintado. | `translateY` + clase. |
| 13 | FAQ | Apertura animada de `<details>`. | `interpolate-size: allow-keywords` + `::details-content` (mejora progresiva: donde no exista abre sin animación). |
| 14 | CTA final | El logo «D» **gira al entrar** (`rotation:-180 → 0, scale:0 → 1, back.out(2)`) con una ráfaga de partículas, y la frase cae de golpe. Igual que el cierre del anuncio. | GSAP + ScrollTrigger |
| 15 | Botones | Al pulsar: `scale(.96)`. El principal tiene un brillo que barre al pasar el ratón (un pseudo-elemento con gradiente que se desplaza). | CSS |

### Límites
- Anima solo `transform`, `opacity`, `clip-path` y `filter`. El `filter:blur` va **solo en titulares** y se quita (`filter:none`) al terminar la animación.
- Usa `will-change` solo durante la animación.
- Con `prefers-reduced-motion`: sin cortinillas, sin marquesina (el muro queda quieto), sin parallax, sin golpes (fundido simple), sin partículas y sin vídeo automático. La regla global actual de `animation-duration:.01ms` se mantiene.
- Las animaciones de bucle (rayos y marquesina) se pausan fuera de pantalla con `animation-play-state` y el patrón `.hero--off`.

**Hecho cuando:** las 15 animaciones se ven en la vista previa, la consola no da errores, y con `prefers-reduced-motion` emulado la página se ve completa y quieta.

---

## Fase 6. Rediseño sección a sección

Mantén el orden y el contenido y cambia solo el aspecto, con este reparto de fondos:

| Sección | Fondo | Notas |
|---|---|---|
| hero | negro + vídeo de ambiente | etiqueta naranja |
| `.old` | blanco | burbujas, ¡BASTA! en rojo y la tarjeta de fichar trasladada |
| `#dia` | blanco | |
| `#fichaje` | **azul** | como «FICHAN» en el anuncio; la demo de PIN con la interfaz clara de la app |
| `#cuadrante` | blanco | etiqueta naranja «CON IA ✦»; la cuadrícula con los colores `local*` de la app |
| `#reservas` | **naranja** | |
| `#web` | **violeta** | como «CON TU DOMINIO PROPIO»; la demo del navegador queda igual |
| `#registro` | blanco | |
| `#costes` | negro | el simulador destaca en verde |
| `#negocios` | blanco | |
| muro de palabras | negro | nuevo |
| `#planes` | blanco | cabecera de Premium en `--acento` |
| `#faq` | blanco | |
| `.cta` | blanco, como el cierre del anuncio | logo D, eslogan, píldoras «Muy pronto · iOS y Android» y botón de WhatsApp |
| pie | negro | |

Etiquetas Gratis y Premium: Gratis en verde y Premium en `--acento`. El extra va en naranja.

**Hecho cuando:** todas las secciones tienen su fondo, cada texto blanco sobre color cumple un contraste de 4,5:1 o más, y todas las demos funcionan (lista de la fase 7).

---

## Fase 7. Comprobación final

Hazla con la vista previa (`preview_start {name:"landing"}`). No le pidas al usuario que lo mire él.

1. **Demos** (todas siguen funcionando):
   - PIN 1234, 2580, 4321 y uno incorrecto (el incorrecto hace temblar los puntos).
   - Botones «Fichar como…».
   - Cuadrante: notas, preparar y publicar.
   - Reserva completa, aviso en el móvil y confirmar.
   - Cambio de estilo de la web, publicar y despublicar.
   - Corregir y anular en el registro, y pedir el PIN de la gestoría.
   - Deslizadores de costes.
   - Pestañas de negocios.
   - Interruptor de la tabla de planes.
   - FAQ: solo una abierta a la vez.
   - Tarjeta de fichar, ya en `.old`.
2. **Vídeo:** el arranque diferido, los capítulos, la pausa, el diálogo y la pausa fuera de pantalla. En la pestaña de red, comprueba que se pide `anuncio-480.mp4` a 375 px y `anuncio-720.mp4` en escritorio.
3. **Tamaños:** 375×812, 768×1024 y escritorio, **sin scroll horizontal** (`document.documentElement.scrollWidth <= innerWidth`).
4. **Movimiento reducido:** con `prefers-reduced-motion` emulado, todo se ve y nada se mueve solo.
5. **Rendimiento:** el peso inicial, sin vídeo, debe quedar por debajo de 400 KB (HTML, CSS, JS, fuentes y póster). El vídeo solo se pide después de `load`. Sin saltos de maquetación visibles al cargar las fuentes.
6. **Marca:** `grep -ri "multinegocio" index.html css js` no devuelve nada, salvo el nombre del repo si aparece en algún comentario.
7. **Netlify:** en `netlify.toml`, añade caché para `/media/*` (`public, max-age=604800`) y para `/vendor/*` (`public, max-age=31536000, immutable`).
8. Haz capturas de escritorio y móvil, y envíalas al usuario con `SendUserFile`.
9. Haz el commit final y **pregunta** antes de hacer push y antes de cualquier deploy.

---

## Riesgos y cosas pendientes del usuario

- **«GRATIS HASTA 10 EMPLEADOS»** sale en el vídeo hacia el segundo 34, pero la app dice «Gratis hasta 3 locales» y no limita empleados. Si alguien ve las dos cosas, se contradicen. Antes de publicar, que el usuario decida si se cambia la app, la landing o el vídeo. Si se regrabara, sería en una **copia** del anuncio (`grabar.mjs --nombre=…`), sin tocar NOMBRE_APP.
- **«Muy pronto»** en el vídeo frente a la «prueba de 14 días» en la landing: la llamada final de la fase 3 ya concilia las dos.
- **El nombre «Durísima»:** el repo y la app Expo siguen llamándose «app-multinegocio». Eso no se toca en este plan.
- **Peso del repo:** unos 8 MB de vídeo en git. Es aceptable, pero si el vídeo cambia a menudo, conviene moverlo a un almacenamiento externo.
