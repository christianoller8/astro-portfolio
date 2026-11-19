// Contenido de los casos (plan §5.4) que no vive en el .md de cada proyecto: decisiones, pruebas y
// "lo que más disfruté". TEXTOS PROVISIONALES, pendientes de Christian: describen lo que se ve en
// cada pantalla, pero las frases de "lo que más disfruté" no son suyas todavía.

type Lang = 'es' | 'en';
type Text = Record<Lang, string>;

export interface Decision {
  title: Text;
  body: Text;
  /** Anotación de herramienta: el dato que resume la decisión */
  note: Text;
}

export interface CaseContent {
  decisions: Decision[];
  /** Un titular corto (cabe en dos líneas) y la frase que lo explica */
  enjoyed: { title: Text; body: Text };
  /** Pruebas que no se pueden calcular en la página (una web publicada): se enseñan tal cual */
  tests?: Text[];
}

export const caseLabels = {
  es: {
    problem: 'El problema',
    sketch: 'Del boceto a la tinta',
    sketchLead: 'La pantalla clave, primero a lápiz. Baja y se entinta.',
    pencil: 'grafito',
    ink: 'tinta',
    decisions: 'Decisiones',
    code: 'Código',
    codeLead: 'La pieza de al lado es real: tócala. Este es el código que la mueve en esta página.',
    tests: 'Pruebas',
    testsLive: 'Comprobado ahora, en tu navegador, sobre la pieza de arriba.',
    testsStatic: 'Lo que se revisó antes de publicarla.',
    result: 'Resultado',
    features: 'Qué hace',
    enjoyed: 'Lo que más disfruté',
    enjoyedLead: 'Lo que más disfruté:',
    next: 'Siguiente proyecto',
    checks: {
      contrast: 'Contraste del botón principal',
      target: 'Zona táctil más pequeña',
      names: 'Controles con nombre',
      keyboard: 'Se maneja con teclado',
      type: 'Texto más pequeño',
    },
  },
  en: {
    problem: 'The problem',
    sketch: 'From sketch to ink',
    sketchLead: 'The key screen, in pencil first. Scroll and it gets inked.',
    pencil: 'graphite',
    ink: 'ink',
    decisions: 'Decisions',
    code: 'Code',
    codeLead: 'The piece next to this is real: touch it. This is the code that drives it on this page.',
    tests: 'Tests',
    testsLive: 'Checked right now, in your browser, on the piece above.',
    testsStatic: 'What was reviewed before publishing it.',
    result: 'Result',
    features: 'What it does',
    enjoyed: 'What I enjoyed most',
    enjoyedLead: 'What I enjoyed most:',
    next: 'Next project',
    checks: {
      contrast: 'Main button contrast',
      target: 'Smallest touch target',
      names: 'Controls with a name',
      keyboard: 'Works with the keyboard',
      type: 'Smallest text',
    },
  },
};

export const cases: Record<string, CaseContent> = {
  tempora: {
    decisions: [
      {
        title: { es: 'Todo el día en una pantalla', en: 'The whole day on one screen' },
        body: {
          es: 'Turnos, fichajes y pendientes se leen sin cambiar de vista: tres cifras arriba y la tabla debajo.',
          en: 'Shifts, clock-ins and pending ones read without changing view: three figures on top, the table below.',
        },
        note: { es: '3 cifras + 1 tabla', en: '3 figures + 1 table' },
      },
      {
        title: { es: 'El estado se lee dos veces', en: 'Status reads twice' },
        body: {
          es: 'Cada fichaje lleva color y texto, «Fichado» o «Pendiente». No depende solo del color.',
          en: 'Each clock-in has colour and text, “Clocked in” or “Pending”. It never relies on colour alone.',
        },
        note: { es: 'color + texto', en: 'colour + text' },
      },
      {
        title: { es: 'La acción principal, a mano', en: 'The main action, within reach' },
        body: {
          es: '«Nuevo turno» va arriba a la derecha y es el único botón con el color de la marca.',
          en: '“New shift” sits top right and is the only button in the brand colour.',
        },
        note: { es: '1 acción primaria', en: '1 primary action' },
      },
    ],
    enjoyed: {
      title: { es: 'Una tabla también se diseña.', en: 'A table gets designed too.' },
      body: { es: 'ordenar mucha información en una sola pantalla sin que agobie.', en: 'fitting a lot of information on a single screen without it feeling heavy.' },
    },
  },
  vibora: {
    decisions: [
      {
        title: { es: 'Primero, qué está libre', en: 'First, what is free' },
        body: {
          es: 'La parrilla enseña pistas y horas a la vez: lo ocupado se apaga y lo libre destaca.',
          en: 'The grid shows courts and times at once: taken slots fade and free ones stand out.',
        },
        note: { es: 'pistas × horas', en: 'courts × times' },
      },
      {
        title: { es: 'Reservar en dos toques', en: 'Booking in two taps' },
        body: {
          es: 'Eliges hueco y confirmas. El resumen de abajo repite pista, hora y duración antes de confirmar.',
          en: 'Pick a slot and confirm. The summary below repeats court, time and duration before you confirm.',
        },
        note: { es: '2 toques', en: '2 taps' },
      },
      {
        title: { es: 'Tu reserva no se pierde de vista', en: 'Your booking stays in sight' },
        body: {
          es: 'El hueco elegido cambia de color y de texto: «Tu reserva».',
          en: 'The chosen slot changes colour and text: “Your booking”.',
        },
        note: { es: 'color + texto', en: 'colour + text' },
      },
    ],
    enjoyed: {
      title: { es: 'Quitar pasos cuesta más que añadirlos.', en: 'Removing steps is harder than adding them.' },
      body: { es: 'dejar la reserva en dos toques.', en: 'getting a booking down to two taps.' },
    },
  },
  learnish: {
    decisions: [
      {
        title: { es: 'Una tarjeta, una frase', en: 'One card, one phrase' },
        body: {
          es: 'Cada tarjeta pregunta una sola cosa, y la respuesta no se ve hasta que la pides.',
          en: 'Each card asks a single thing, and the answer stays hidden until you ask for it.',
        },
        note: { es: '1 frase por tarjeta', en: '1 phrase per card' },
      },
      {
        title: { es: 'Tú decides si lo sabías', en: 'You decide whether you knew it' },
        body: {
          es: '«Repasar» o «Lo sabía»: dos botones grandes, al alcance del pulgar.',
          en: '“Review” or “Got it”: two large buttons within reach of the thumb.',
        },
        note: { es: '2 respuestas', en: '2 answers' },
      },
      {
        title: { es: 'El avance, a la vista', en: 'Progress, always visible' },
        body: {
          es: 'La barra y el «7 de 10» dicen cuánto queda de lección; la racha, cuántos días llevas.',
          en: 'The bar and “7 of 10” say how much of the lesson is left; the streak, how many days in a row.',
        },
        note: { es: 'progreso + racha', en: 'progress + streak' },
      },
    ],
    enjoyed: {
      title: { es: 'Una lección por trayecto de metro.', en: 'One lesson per metro ride.' },
      body: { es: 'pensar en ratos cortos, que es cuando de verdad se aprende.', en: 'designing for short moments, which is when people actually learn.' },
    },
  },
  vistalo: {
    decisions: [
      {
        title: { es: 'Todo sale del nombre', en: 'Everything comes from the name' },
        body: {
          es: '«Vístelo»: ponle su mejor traje. Los packs son etiquetas de ropa colgadas de una barra y la cinta métrica hace de marquesina.',
          en: '“Vístelo”: dress it in its best suit. The packs are clothing tags hanging from a rail and the tape measure is the marquee.',
        },
        note: { es: 'concepto: sastrería', en: 'concept: tailoring' },
      },
      {
        title: { es: 'Sin librerías de animación', en: 'No animation libraries' },
        body: {
          es: 'Cada efecto está hecho con CSS y JavaScript propio, y respeta la preferencia de reducir el movimiento.',
          en: 'Every effect is hand-written CSS and JavaScript, and respects the reduced-motion preference.',
        },
        note: { es: '0 librerías', en: '0 libraries' },
      },
      {
        title: { es: 'El contacto es una carta', en: 'Contact is a letter' },
        body: {
          es: 'Con firma a pluma y resguardo en vivo, en lugar de un formulario al uso.',
          en: 'With a pen signature and a live receipt, instead of a standard form.',
        },
        note: { es: 'formulario → carta', en: 'form → letter' },
      },
    ],
    tests: [
      { es: 'Móvil · 390 px', en: 'Phone · 390 px' },
      { es: 'Tablet · 768 px', en: 'Tablet · 768 px' },
      { es: 'Escritorio · 1280 px', en: 'Desktop · 1280 px' },
      { es: 'Se usa con teclado', en: 'Works with the keyboard' },
      { es: 'Respeta reducir movimiento', en: 'Respects reduced motion' },
    ],
    enjoyed: {
      title: { es: 'Toda la web sale de una idea.', en: 'It all comes from one idea.' },
      body: { es: 'partir del nombre y hacerla con Eloi, cada uno en lo suyo.', en: 'starting from the name and making it with Eloi, each of us on our own part.' },
    },
  },
};
