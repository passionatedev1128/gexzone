# GEXZONE — Sitio web

Sitio estático de la academia de trading GEXZONE. Diseñado para integrarse después en **Odoo** (constructor de sitio y CRM).

## Estructura

- **index.html** — Página de inicio: heros intercalados con 2 bloques HTML embebidos, video skyline y testimonios.
- **formacion.html** — Formación: BEYOND THE FLOW, De Cero a Experto, Flow Dynamics, Manual de Opciones, Pensar como un Market Maker, Trading Room, Convocatorias.
- **trading-room.html** — Trading Room: operativa en vivo y acceso.
- **recursos.html** — Recursos gratuitos (Manual de Opciones, texto inicial + zona para enlaces/HTML que añadirás).
- **volatilidad.html** — Dos HTML embebidos: ciclo de volatilidad y spreads VIX.
- **software-bots.html** — Sección “Próximamente” para productos en desarrollo.
- **contacto.html** — CTA “Evalúa tu perfil”, formulario de contacto y chatbot flotante.
- **legal/** — Placeholders: Términos y condiciones, Política de cookies, Aviso legal / Financial advisor.

## Cómo ver el sitio en local

1. Abre la carpeta del proyecto en el editor.
2. Sirve los archivos con un servidor local (evita problemas con iframes y rutas):
   - **VS Code / Cursor:** extensión “Live Server” → clic derecho en `index.html` → “Open with Live Server”.
   - **Node:** `npx serve .` en la raíz del proyecto.
   - **Python:** `python -m http.server 8000` en la raíz.
3. Abre en el navegador la URL que indique el servidor (ej. `http://localhost:5500/index.html` o `http://localhost:8000`).

## Funcionalidad incluida

- **Tema día/noche:** botón en la cabecera (☀/🌙); preferencia guardada en `localStorage`.
- **Idiomas ES / AR:** botón ES/AR; textos con `data-i18n` se traducen; RTL automático en árabe.
- **Chatbot:** botón flotante; al abrir muestra mensaje de bienvenida; respuestas automáticas de ejemplo (en producción conectar con tu backend/Odoo).
- **Responsive:** menú hamburguesa en móvil, secciones adaptadas.
- **Video:** sección con video de skyline (sustituir `source` por tu propio archivo o enlace definitivo).

## Integración con Odoo

- Cada página puede replicarse como **bloques HTML** o **secciones** en el constructor de Odoo.
- Los iframes que cargan `reference_htmls/*.html` pueden sustituirse por **bloques HTML** de Odoo pegando el contenido, o manteniendo los archivos en un recurso estático y embeber por URL.
- Formulario de contacto y CTA “Evalúa tu perfil”: en Odoo conectar a **Formulario de contacto** y **CRM / Calendario** según tu flujo.
- Legal: sustituir el contenido de `legal/*.html` por los textos definitivos (asesoría legal) y enlazarlos desde el footer.

## Próximos pasos sugeridos

1. Sustituir el video del skyline por tu archivo o URL definitiva.
2. Añadir en **Recursos** los enlaces y HTML que tengas preparados.
3. Redactar e insertar textos legales (términos, cookies, aviso / financial advisor).
4. Conectar formulario de contacto y CTA de contacto al CRM/calendario de Odoo.
5. Si quieres más respuestas automáticas en el chatbot, integrar con un backend o con Odoo (chat/livechat).
