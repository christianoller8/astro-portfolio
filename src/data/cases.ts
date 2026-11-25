// Contenido de los casos (plan §5.4) que no vive en el .md de cada proyecto: decisiones, pruebas,
// código y "lo que más disfruté". Revisados por Christian en dos rondas (24 nov) y cotejados con el
// código de cada app: si una app cambia, se vuelven a cotejar con su repo.

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
  /**
   * Código real de la app, copiado de su repo a src/data/case-code/<slug>.txt (líneas exactas, sin
   * la sangría común). Sin él, el apartado Código enseña el de la demo de esta página
   */
  code?: { file: string; lang: 'ts' | 'sql' | 'js' };
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
    codeLead: 'La pieza de al lado funciona: pruébala. Este es el código que la mueve en esta página.',
    codeLeadReal: 'La pieza de al lado imita la app y se puede tocar. Este es el código de la app que hace ese trabajo de verdad.',
    tests: 'Pruebas',
    testsLive: 'Comprobado ahora, en tu navegador, sobre la pieza de arriba.',
    testsStatic: 'Lo que se ha revisado hasta ahora.',
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
    codeLead: 'The piece next to this one works: try it. This is the code that drives it on this page.',
    codeLeadReal: 'The piece next to it mimics the app and you can try it. This is the code in the app that does that job for real.',
    tests: 'Tests',
    testsLive: 'Checked right now, in your browser, on the piece above.',
    testsStatic: 'What has been checked so far.',
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
        title: { es: 'El mes entero, de un vistazo', en: 'The whole month at a glance' },
        body: {
          es: 'El cuadrante pone a cada persona en una fila y cada día en una columna, con el turno en su casilla.',
          en: 'The rota puts each person on a row and each day in a column, with the shift in its cell.',
        },
        note: { es: 'personas × días', en: 'people × days' },
      },
      {
        title: { es: 'El turno se lee dos veces', en: 'Each shift reads twice' },
        body: {
          es: 'Cada casilla lleva el color del turno y su letra: M, T, N… No depende solo del color.',
          en: 'Every cell carries the shift’s colour and its letter: M, T, N… It never relies on colour alone.',
        },
        note: { es: 'color + letra', en: 'colour + letter' },
      },
      {
        title: { es: 'El turno se pone en su casilla', en: 'The shift goes in its cell' },
        body: {
          es: 'No hay que buscar un botón: pulsas la casilla del día, o le das a Intro, y eliges el turno.',
          en: 'No button to look for: click the day’s cell, or press Enter, and choose the shift.',
        },
        note: { es: 'clic o teclado', en: 'click or keyboard' },
      },
    ],
    // Al poner un turno, el backend lo comprueba con esta regla del descanso mínimo
    code: { file: 'tempora/backend/src/modules/rules/rules/min-rest.ts · 56–104', lang: 'ts' },
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
          es: 'La agenda enseña las horas de una pista en el día: lo ocupado lleva trama y lo libre, contorno y precio.',
          en: 'The schedule shows one court’s hours for the day: taken slots get a hatch pattern and free ones an outline and their price.',
        },
        note: { es: 'trama + precio', en: 'hatch + price' },
      },
      {
        title: { es: 'Reservar en dos pasos', en: 'Booking in two steps' },
        body: {
          es: 'Eliges hueco y confirmas. Antes de reservar, un diálogo repite club, pista, fecha, hora y precio.',
          en: 'Pick a slot and confirm. Before booking, a dialog repeats club, court, date, time and price.',
        },
        note: { es: '2 pasos', en: '2 steps' },
      },
      {
        title: { es: 'Tu reserva no se pierde de vista', en: 'Your booking stays in sight' },
        body: {
          es: 'El hueco elegido cambia de aspecto y dice «Seleccionada» mientras confirmas; después, la reserva aparece en «Mis reservas».',
          en: 'The chosen slot changes look and reads “Selected” while you confirm; then the booking shows up under “My bookings”.',
        },
        note: { es: 'color + texto', en: 'colour + text' },
      },
    ],
    // Dos reservas confirmadas no pueden pisarse: lo impide la propia base de datos
    code: { file: 'vibora/vibora-backend/src/main/resources/db/migration/V1__init_schema.sql · 58–79', lang: 'sql' },
    enjoyed: {
      title: { es: 'Quitar pasos cuesta más que añadirlos.', en: 'Removing steps is harder than adding them.' },
      body: { es: 'dejar la reserva en dos pasos.', en: 'getting a booking down to two steps.' },
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
        title: { es: 'Tú decides cuánto te costó', en: 'You decide how hard it was' },
        body: {
          es: '«Otra vez», «Difícil», «Bien» o «Fácil»: cuatro botones, también con las teclas 1 a 4.',
          en: '“Again”, “Hard”, “Good” or “Easy”: four buttons, also on keys 1 to 4.',
        },
        note: { es: '4 respuestas', en: '4 answers' },
      },
      {
        title: { es: 'El avance, a la vista', en: 'Progress, always visible' },
        body: {
          es: 'La barra y el «7 de 10» dicen cuánto queda de la sesión de tarjetas; la racha, cuántos días llevas.',
          en: 'The bar and “7 of 10” say how much of the card session is left; the streak, how many days in a row.',
        },
        note: { es: 'progreso + racha', en: 'progress + streak' },
      },
    ],
    // Cada uno de los cuatro botones decide cuándo vuelve la tarjeta
    code: { file: 'learnish/server/src/domain/srs.js · 39–66', lang: 'js' },
    enjoyed: {
      title: { es: 'Tareas que caben en un descanso.', en: 'Tasks that fit into a break.' },
      body: { es: 'pensar en ratos cortos, que es cuando de verdad se aprende.', en: 'designing for short moments, which is when people actually learn.' },
    },
  },
  vistalo: {
    decisions: [
      {
        title: { es: 'Todo sale del nombre', en: 'Everything comes from the name' },
        body: {
          es: 'Vístalo es ponerle a un negocio su mejor traje. Los packs son etiquetas de ropa colgadas de una barra y la cinta métrica hace de marquesina.',
          en: '“Vístalo” means dress it up: a business in its best suit. The packs are clothing tags hanging from a rail and the tape measure is the marquee.',
        },
        note: { es: 'concepto: sastrería', en: 'concept: tailoring' },
      },
      {
        title: { es: 'Sin librerías de animación', en: 'No animation libraries' },
        body: {
          es: 'Cada efecto está hecho con CSS y JavaScript propio, y respeta la preferencia de reducir el movimiento.',
          en: 'Every effect is hand-written CSS and JavaScript, and respects the reduced-motion preference.',
        },
        note: { es: '0 librerías de animación', en: '0 animation libraries' },
      },
      {
        title: { es: 'El contacto es una carta', en: 'Contact is a letter' },
        body: {
          es: 'Es un formulario con forma de carta: firma a pluma y un resguardo en vivo.',
          en: 'It is a form shaped like a letter: a pen signature and a live receipt.',
        },
        note: { es: 'formulario → carta', en: 'form → letter' },
      },
    ],
    tests: [
      { es: 'Escritorio · de 1280 a 1920 px', en: 'Desktop · 1280 to 1920 px' },
      { es: 'Contraste AA con axe-core', en: 'AA contrast with axe-core' },
      { es: 'Se usa con teclado', en: 'Works with the keyboard' },
      { es: 'Respeta reducir movimiento', en: 'Respects reduced motion' },
    ],
    enjoyed: {
      title: { es: 'Toda la web sale de una idea.', en: 'It all comes from one idea.' },
      body: { es: 'partir del nombre y hacerla con Eloi, cada uno en lo suyo.', en: 'starting from the name and making it with Eloi, each of us on our own part.' },
    },
  },
};
