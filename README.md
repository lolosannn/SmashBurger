# Smash Burger

Landing page para una hamburguesería, hecha en HTML/CSS/JS puro (sin build step) para poder iterar directo en GitHub Pages y luego desplegar en Vercel sin configuración extra.

## Ver en local

Abrí `index.html` en el navegador, o serví la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Estructura

```
index.html        # markup y contenido
css/style.css      # design tokens + estilos
js/main.js         # preloader, header on scroll, menú mobile, render del menú
menu.json          # datos del menú (nombre, descripción, precio, etiqueta, foto)
images/            # fotos (hero + platos)
admin.html         # panel para editar menu.json y subir fotos sin tocar código
```

## Editar el menú

No hace falta tocar código ni GitHub a mano: abrí **`admin.html`** (en local o en
`https://lolosannn.github.io/SmashBurger/admin.html`), pegá un token de GitHub con permiso
de escritura sobre este repo, y desde ahí podés agregar, sacar, reordenar y editar platos
(nombre, descripción, precio, etiqueta, foto) y la foto de portada. Los cambios se guardan
directo en `menu.json` y en `images/`, y el sitio los toma solo.

## Diseño

- **Paleta**: fondo crema (`--cream`), rojo (`--red`) y amarillo mostaza (`--yellow`) sobre tinta oscura (`--ink`), inspirada en el estilo "sticker / die-cut" (bordes gruesos + sombra dura desplazada).
- **Tipografías**: [Fredoka](https://fonts.google.com/specimen/Fredoka) para títulos/branding, [Nunito](https://fonts.google.com/specimen/Nunito) para texto de cuerpo.
- **Preloader**: contador 0→100% con reveal tipo cortina, inspirado en la pantalla de carga de referencia. El resto del sitio es intencionalmente estático — sin scroll-animations ni parallax, solo transiciones cortas en hover/click.
- **Gráficos**: la burger del preloader y de la sección "Nosotros" son 100% CSS/SVG. El hero flota como recorte (PNG con transparencia) y las cards del menú usan fotos reales.

## Pendiente de personalizar

- Dirección, teléfono y horarios reales (sección `#ubicacion` y footer).
- Link de WhatsApp (`https://wa.me/...`) en el botón "Pedir por WhatsApp".
- Redes sociales (los `href="#"` en el footer).
- Reemplazar el mapa placeholder por un embed real (Google Maps) si querés uno interactivo.

## Nota sobre `index.html` en local

El menú se carga con `fetch("menu.json")`, que los navegadores bloquean si abrís
`index.html` directo desde el disco (`file://`). Para verlo en local, serví la carpeta
con un servidor estático (ver arriba) en vez de abrir el archivo con doble click.

## Deploy

- **GitHub Pages**: Settings → Pages → Deploy from branch → `main` / `/root`.
- **Vercel**: importá el repo, framework "Other", sin build command — sirve `index.html` tal cual.
