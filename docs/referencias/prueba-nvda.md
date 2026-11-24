# Prueba con lector de pantalla (NVDA)

Una pasada de unos 30 minutos por la web publicada con NVDA, el lector de pantalla gratuito de
Windows, para cerrar la casilla de **Accesibilidad** del roadmap. Cada punto dice qué hacer y qué
debería oírse. Marca ✅ o ❌ y, si falla, apunta lo que dijo NVDA: con eso basta para arreglarlo.

Lo esperado sale del árbol de accesibilidad real de la web (medido el 23 nov de 2026 sobre la versión
publicada ese día).

## Antes de empezar (5 min)

1. Descarga NVDA de [nvaccess.org](https://www.nvaccess.org/download/) (gratis). Puedes instalarlo o
   usar la copia portátil.
2. Abre Chrome (o Firefox) en <https://www.christianoller.dev/> y maximiza la ventana.
3. Arranca NVDA con `Ctrl+Alt+N`. `Ctrl` lo calla; `Insert+Q` lo cierra.

| Tecla (modo exploración) | Hace |
| --- | --- |
| `Tab` / `Mayús+Tab` | Siguiente / anterior elemento que recibe el foco |
| `H` / `Mayús+H` | Siguiente / anterior encabezado |
| `1` a `6` | Siguiente encabezado de ese nivel |
| `D` | Siguiente punto de referencia (cabecera, navegación, principal…) |
| `B` · `F` · `K` | Siguiente botón · campo de formulario · enlace |
| `Insert+F7` | Lista de encabezados, enlaces y puntos de referencia |
| `Insert+Espacio` | Cambia entre modo exploración y modo foco |
| Flechas | Leer línea a línea |

> En modo exploración NVDA se queda las teclas `1`, `2`, `3` y `M` (la `1` salta al primer
> encabezado de nivel 1). Es lo normal: los atajos de la web no se disparan y no es un fallo. Las
> lentes se abren desde el bocadillo (punto 5).

Tropiezos de la primera vez (24 nov):

- **Teclados sin `Insert`** (el Logitech MX, por ejemplo): usa `Bloq Mayús` como tecla NVDA. Icono
  de NVDA junto al reloj → clic derecho → Preferencias → Opciones → Teclado → marcar **Bloq Mayús**.
  En los MX, las teclas F piden `Fn` (o se fijan con `Fn+Esc`).
- **Si NVDA solo dice "Chrome Legacy Window"**, Chrome no le está dando la página: suele seguir
  abierto en segundo plano. Ciérralo del todo (⋮ → Salir) y ábrelo con NVDA ya encendido, o usa
  Edge, que funcionó a la primera.
- **El Visor de voz** (`NVDA+N` → Herramientas → Visor de voz) enseña por escrito todo lo que dice
  NVDA: sirve para copiar lo que falle.
- `NVDA+Ctrl+R` tres veces seguidas restablece los ajustes de fábrica (y quita lo de `Bloq Mayús`).

## 1. Inicio: estructura

- [ ] Al cargar, NVDA dice el título: "Christian Oller · Software developer".
- [ ] La intro (la marca que se dibuja) no se lee ni estorba: es solo visual.
- [ ] El primer `Tab` dice "Saltar al contenido, enlace". Con `Enter`, el foco salta al contenido.
- [ ] `Insert+F7` → Puntos de referencia: cabecera (banner), navegación "Menú" y principal.
- [ ] `H` recorre los encabezados en orden: "Christian Oller Software developer" (nivel 1),
      "Proyectos" (2), Tempora, Vibora, Learnish y Vístalo (3), "Tú ves una web. Yo la veo así." (2),
      "Y todo a la vez, en capas." (3), "Trayectoria" (2) y "¿Hablamos?" (2).
- [ ] En "Tú ves una web. Yo la veo así." **no** se lee la web de ejemplo (la cafetería "Café recién
      tostado en tu puerta."): es una ilustración inerte. Si aparece un segundo encabezado de nivel 1,
      apúntalo.
- [ ] Los botones "Diseñador", "Desarrollador" y "QA" del principio: ¿se entiende qué hacen al
      pulsarlos?

## 2. Barra: menú, idioma y tema

- [ ] En la navegación "Menú", el enlace de la página en la que estás dice "página actual".
- [ ] Grupo "Idioma": "ES, cambiar a español" y "EN, cambiar a inglés"; el activo dice "actual".
- [ ] Grupo "Tema": "Tema claro, presionado" y "Tema oscuro". Al pulsar "Tema oscuro", NVDA dice
      "presionado" y la web cambia.

## 3. Proyectos y sus demos (en la home)

- [ ] Con `Tab` por la pila de proyectos, la tarjeta que recibe el foco queda a la vista, no tapada
      por la siguiente (si miras la pantalla).
- [ ] Tempora, "+ Nuevo turno": NVDA anuncia el resultado sin mover el foco.
- [ ] Vibora: "Libre", "Tu reserva, presionado" y "Confirmar"; al confirmar, anuncia la reserva.
- [ ] Learnish, "Ver respuesta": se anuncia la respuesta, y "Repasar" y "Lo sabía" dejan de estar
      desactivados.
- [ ] Vístalo, "Abrir la web aquí": se abre el marco con la web, NVDA lo anuncia como marco y el botón
      pasa a decir "Volver a la captura".

## 4. Capas 3D (home)

- [ ] "Girar las cuatro capas de la web de ejemplo" es un deslizador: con las flechas dice "De
      frente", "60 grados a la izquierda", "60 grados a la derecha"…
- [ ] "Separación" es otro deslizador (valor 55): con las flechas cambia el valor y lo dice.

## 5. El bocadillo: lentes, lienzo y atajos

- [ ] `B` hasta "¿Quieres verlo como yo?" (está al final de la página).
- [ ] Al pulsarlo, el grupo se abre y el foco va a "Diseño 1" (dice también la tecla del atajo).
- [ ] "QA 3" pone la lente QA: NVDA lee el título de la lente que aparece abajo. ¿Te enteras de que
      está puesta?
- [ ] "Atajos de teclado" es un interruptor: dice "activado" y, al pulsarlo, "desactivado".
- [ ] `Escape` cierra el bocadillo y el foco vuelve al botón.
- [ ] "Ver lienzo M" abre el diálogo "Lienzo: todas las páginas del portfolio" y el foco va a
      "Inicio… Estás aquí". `Tab` recorre las páginas; `Enter` en "Sobre mí" te lleva allí.
- [ ] Con el lienzo abierto, en modo exploración, ¿puedes salirte con las flechas a la página que
      hay detrás? Apúntalo si pasa.

## 6. Cambio de página

- [ ] Desde el menú, al ir a Proyectos NVDA anuncia "Proyectos · Christian Oller", y el siguiente
      `Tab` vuelve a ser "Saltar al contenido".
- [ ] En Proyectos, el grupo "Ver los proyectos como": "Cajas, presionado" y "Lienzo".

## 7. Contacto

- [ ] Grupo "Sobre qué": con las flechas cambias entre "Oferta de empleo", "Proyecto freelance" y
      "Otra cosa", y NVDA dice cuál.
- [ ] "Nombre", "Email" y "Mensaje" dicen "obligatorio"; "Empresa (opcional)" no.
- [ ] Enviar sin rellenar: NVDA lee el resumen de errores, el foco va a "Nombre" y cada campo dice
      su error al llegar a él.
- [ ] Al escribir bien un campo, su error desaparece.
- [ ] "Copiar" (el email): NVDA dice "Copiado".
- [ ] Solo cuando el formulario ya funcione, y sabiendo que es un envío real: al enviar bien, NVDA
      anuncia "Mensaje enviado".

## 8. Privacidad, pie y 404

- [ ] En Privacidad, `D` recorre las secciones por su título ("Quién es el responsable"…).
- [ ] "No contar mis visitas": al pulsarlo, NVDA anuncia el cambio.
- [ ] En el pie, "Volver arriba" con `Enter`: la página sube y el foco va a "Saltar al contenido".
- [ ] <https://www.christianoller.dev/no-existe/>: título "404 · Christian Oller", encabezado
      "Frame no encontrado", enlace "Volver al inicio", botón "Ver el lienzo M" y la navegación "Los
      frames que sí existen".

## 9. En inglés (5 min)

- [ ] En <https://www.christianoller.dev/en/>, NVDA cambia a voz inglesa y los nombres de los botones
      están en inglés.

## Lo que ya se vio al preparar la lista

No son fallos confirmados: espera a ver si te molestan en la prueba.

- El pie está dentro de `<main>`, así que no cuenta como punto de referencia propio ("información de
  contenido").
- El bocadillo, el panel de las lentes y el lienzo quedan fuera de todos los puntos de referencia.
- Algunos nombres incluyen la tecla del atajo ("Diseño 1", "Ver lienzo M", "Cerrar lienzo Esc"), y
  NVDA la lee como parte del nombre.
- El lienzo es un diálogo, pero no modal.

## Cómo pasar los resultados

Copia en el chat los puntos con ❌ y lo que dijo NVDA (o "no dijo nada"). Con eso se arreglan, se
vuelve a probar lo que falló y se marca la casilla.
