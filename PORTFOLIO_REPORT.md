# Informe del Portfolio — Christian Oller

**Fecha:** Junio 2026  
**URL de producción:** `https://midominio.com` _(placeholder — pendiente de actualizar)_

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Diseño y sistema visual](#diseño-y-sistema-visual)
4. [Internacionalización (i18n)](#internacionalización-i18n)
5. [Páginas y secciones](#páginas-y-secciones)
6. [Copies completos](#copies-completos)
7. [Proyectos del portfolio](#proyectos-del-portfolio)
8. [Componentes](#componentes)
9. [Observaciones y deuda técnica](#observaciones-y-deuda-técnica)

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Astro 5.16.7 |
| Estilos | Tailwind CSS v4 (vía `@tailwindcss/vite`) |
| Tipografía | Inter (sans-serif) + Playfair Display (serif) |
| Lenguaje | TypeScript (modo estricto) |
| Transiciones | Astro `ClientRouter` (navegación tipo SPA) |
| Contenido | Astro Content Collections (Markdown + Zod) |
| Testing E2E | Playwright (Chrome, Mobile Chrome/Pixel 5, Mobile Safari/iPhone 12) |
| Linting | ESLint 9 (flat config) + typescript-eslint + eslint-plugin-astro + jsx-a11y |
| Formateo | Prettier 3 + prettier-plugin-astro + prettier-plugin-tailwindcss |
| Package manager | pnpm |
| Deployment | Build estático (`astro build`) → `dist/` |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── common/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ThemeToggle.astro
│   ├── landing/
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── LogoGrid.astro
│   │   ├── AboutSummary.astro
│   │   └── FeaturedWork.astro
│   └── pages/
│       ├── AboutPage.astro
│       ├── ContactPage.astro
│       ├── ProjectsPage.astro
│       └── ProjectPage.astro
├── content/
│   ├── config.ts
│   └── projects/
│       ├── project-1.md   → EcoMarket Marketplace
│       ├── project-2.md   → TaskFlow Analytics
│       └── project-3.md   → SkyLink Intranet
├── i18n/
│   ├── ui.ts              → todas las strings traducibles
│   └── utils.ts           → getLangFromUrl, useTranslations, useTranslatedPath
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro              → Inicio ES (/)
│   ├── about.astro              → Sobre mí ES (/about)
│   ├── contact.astro            → Contacto ES (/contact)
│   ├── projects/
│   │   ├── index.astro          → Proyectos ES (/projects)
│   │   └── [slug].astro         → Detalle de proyecto ES (/projects/:slug)
│   └── en/
│       ├── index.astro          → Home EN (/en)
│       ├── about.astro          → About EN (/en/about)
│       ├── contact.astro        → Contact EN (/en/contact)
│       └── projects/
│           ├── index.astro      → Projects EN (/en/projects)
│           └── [slug].astro     → Project detail EN (/en/projects/:slug)
└── styles/
    └── global.css
```

---

## Diseño y sistema visual

### Paleta de colores

La paleta es intencionalmente **monocromática** — sin color de acento. Los estados interactivos se basan en variaciones de brillo y peso tipográfico, no en un color de marca.

#### Modo claro

| Token CSS | Valor | Uso |
|---|---|---|
| `--bg-color` | `#e5e5e5` | Fondo de página |
| `--text-primary` | `#1a1a1a` | Texto principal |
| `--text-secondary` | `#4a4a4a` | Texto secundario / apagado |
| `--border-accent` | `#d4d4d4` | Bordes |
| `--surface-color` | `#ffffff` | Fondo de tarjetas / superficies |

#### Modo oscuro

| Token CSS | Valor | Uso |
|---|---|---|
| `--bg-color` | `#2c2c2e` | Fondo oscuro profundo |
| `--text-primary` | `#f5f5f5` | Texto blanco suave |
| `--text-secondary` | `#a3a3a3` | Texto gris claro |
| `--border-accent` | `#262626` | Borde oscuro |
| `--surface-color` | `#171717` | Superficie oscura |

### Tipografía

| Fuente | Rol | Uso |
|---|---|---|
| **Inter** | Sans-serif | Cuerpo de texto, etiquetas, navegación |
| **Playfair Display** | Serif | Headings H1 y H2, títulos de proyectos |

Esta combinación crea un contraste editorial clásico — los headings tienen carácter con la serif, el cuerpo se mantiene limpio y legible con la sans.

### Layout y espaciado

| Propiedad | Valor |
|---|---|
| Ancho máximo de contenido | `max-w-[1400px]` centrado con `mx-auto` |
| Padding horizontal | `px-6` (mobile) / `px-12` (md) / `px-20` (lg) |
| Espaciado entre secciones | `space-y-12 md:space-y-20 lg:space-y-24` |
| Padding vertical de secciones | `py-12 md:py-16 lg:py-20/24` |
| Altura del header | `h-16`, sticky con `backdrop-blur-md` |

### Patrones de componentes

- **Tarjetas:** `rounded-lg border` con `shadow-lg` en hover
- **Botones primarios:** `rounded-full bg-foreground text-background px-8 py-3 hover:scale-105`
- **Inputs de formulario:** `h-12 rounded-lg border px-4 focus:ring-1 focus:border-primary`
- **Timeline de experiencia:** `border-l` con punto absoluto `h-2.5 w-2.5 rounded-full`
- **Tiles de tecnología:** fill deslizante con pseudo-elemento `before:` (`before:w-0 hover:before:w-full`)
- **Transiciones de vista:** `transition:animate="fade"` en `<body>`, `transition:name` en imágenes de proyectos

### Tema claro/oscuro

El modo oscuro se activa añadiendo/quitando la clase `.dark` en `<html>`. La preferencia se persiste en `localStorage` bajo la clave `theme`. El botón `ThemeToggle` muestra un icono de sol (en modo oscuro) o luna (en modo claro).

---

## Internacionalización (i18n)

**Configuración:**
- Locale por defecto: `es` (Español) — sin prefijo en URL, se sirve en `/`
- Locale secundaria: `en` (English) — se sirve en `/en/`
- `prefixDefaultLocale: false`

**Patrón de implementación:**
- Todas las strings traducibles viven en `src/i18n/ui.ts`
- `getLangFromUrl(url)` lee el locale desde el primer segmento de la URL
- `useTranslations(lang)` retorna una función `t(key)` que hace fallback a `es` si falta una clave
- `useTranslatedPath(lang)` genera paths correctos para cada locale
- Las páginas son wrappers delgados que pasan `lang="es"` o `lang="en"` a los componentes compartidos

**Estado actual de i18n por componente:**

| Componente | i18n activo |
|---|---|
| Header | ✅ Sí |
| Footer | ❌ No (texto hardcoded en inglés) |
| Hero | ❌ No (hardcoded en español) |
| Services | ❌ No (hardcoded en español) |
| LogoGrid | ❌ No (hardcoded en español) |
| AboutSummary | ❌ No (hardcoded en español) |
| FeaturedWork | ❌ No (hardcoded en español) |
| AboutPage | ✅ Parcial (headings i18n, párrafos hardcoded) |
| ContactPage | ✅ Sí |
| ProjectsPage | ✅ Sí |
| ProjectPage | ✅ Sí |

---

## Páginas y secciones

### Inicio (`/` y `/en/`)

| Sección | Contenido |
|---|---|
| **Hero** | Saludo + nombre en H1 serif + trío de roles (Designer / Developer / QA) + descripción + CTA |
| **Services** | 4 tarjetas: Arquitectura Frontend, Soluciones Backend, Implementación UI/UX, Rendimiento y Testing |
| **LogoGrid** | Heading "Tecnologías Clave" + 24 tiles de tecnologías |
| **About Summary** | H2 + 2 párrafos de descripción personal |
| **Featured Work** | H2 + 2 proyectos destacados (project-1 y project-2) + link a todos los proyectos |

### Sobre mí (`/about` y `/en/about`)

| Sección | Contenido |
|---|---|
| **Sidebar sticky** | H1 + foto de perfil |
| **Mi Trayectoria** | H2 + párrafo de presentación profesional |
| **Experiencia Profesional** | H2 + timeline vertical con 4 empleos |

### Contacto (`/contact` y `/en/contact`)

| Sección | Contenido |
|---|---|
| **Columna izquierda** | H1 + intro + email + redes sociales + ubicación |
| **Columna derecha** | Formulario: Nombre, Email, Asunto (select), Mensaje, botón de envío |

### Proyectos (`/projects` y `/en/projects`)

| Sección | Contenido |
|---|---|
| **Header de página** | H1 + descripción |
| **Grid de proyectos** | 3 proyectos en grilla (1→2→3 columnas según breakpoint), ordenados por año desc |

### Detalle de proyecto (`/projects/:slug` y `/en/projects/:slug`)

| Sección | Contenido |
|---|---|
| **Navegación** | Link "Volver a Proyectos" |
| **Header** | H1 serif con título + barra de metadatos (Año / Cliente / Tecnologías) |
| **Imagen hero** | Imagen a ancho completo con view transition |
| **Cuerpo** | Contenido Markdown en contenedor `prose-lg` |

---

## Copies completos

### Navegación global (Header)

| Elemento | Español | Inglés |
|---|---|---|
| Home | Inicio | Home |
| About | Sobre mí | About |
| Projects | Proyectos | Projects |
| Contact | Contacto | Contact |
| Back link | Volver a Proyectos | Back to Projects |
| Selector de idioma | ES / EN | ES / EN |

---

### Inicio — Hero

> _(Hardcoded en español — se muestra igual en `/en/`)_

- **Saludo:** "Hola, soy"
- **Nombre (H1):** "Christian Oller"
- **Roles (H2):** "Designer" × "Developer" × "QA"
- **Descripción:** "Especializado en transformar ideas en experiencias digitales robustas y escalables. Combino la precisión técnica del desarrollo con la sensibilidad del diseño para crear productos que no solo funcionan, sino que destacan."
- **CTA:** "Contactar" → `/contact`
- **Alt de imagen:** "Foto de perfil de Christian Oller"

---

### Inicio — Servicios

> _(Hardcoded en español)_

| Título | Descripción |
|---|---|
| Arquitectura Frontend | Desarrollo aplicaciones complejas con Angular y React. Creo interfaces modulares y mantenibles utilizando TypeScript, optimizando el rendimiento y la reutilización de componentes. |
| Soluciones Backend | Lógica robusta del lado del servidor e integración de APIs (SQL, PHP, Firebase). |
| Implementación UI/UX | Traducción de diseños a código pixel-perfect, accesible y responsive (Tailwind, SASS). |
| Rendimiento y Testing | Garantía de calidad y velocidad mediante Vitest y optimización continua. |

---

### Inicio — Tecnologías Clave

> _(Hardcoded en español)_

**Heading:** "Tecnologías Clave"

**Tiles (24):** HTML5, CSS3, SASS, Bootstrap, Tailwind, PrimeNG, PrimeFlex, React, Next.js, Angular v8-v21, Karma/Jasmine, Cypress, Postman, Node, SQL, MongoDB, Git, Bitbucket, API Rest, GraphQL, WordPress, Figma, Procreate, VSCode

---

### Inicio — About Summary

> _(Hardcoded en español)_

- **H2:** "Creando experiencias digitales intuitivas y memorables"
- **Párrafo 1:** "**Hola, soy Christian Oller.** Me especializo en construir productos digitales que fusionan una estética cuidada con una funcionalidad robusta. Mi enfoque se basa en comprender las necesidades del usuario y traducirlas en interfaces visualmente atractivas y código eficiente."
- **Párrafo 2:** "Con una sólida base tanto en diseño como en desarrollo, actúo como puente entre la visión creativa y la ejecución técnica. Creo firmemente que un buen software no solo debe funcionar bien, sino que también debe sentirse bien al usarse."

---

### Inicio — Proyectos Destacados

> _(Hardcoded en español)_

- **H2:** "Proyectos Destacados"
- **Link:** "Ver todos los proyectos" → `/projects`

---

### Sobre mí

| Elemento | Español | Inglés |
|---|---|---|
| Meta title | Sobre mí \| Christian Oller | About \| Christian Oller |
| Meta description | Conoce más sobre mi trayectoria como desarrollador Full Stack y mi experiencia profesional. | Learn more about my journey as a Full Stack developer and my professional experience. |
| H1 | Sobre mí | About Me |
| Alt de imagen | Foto de perfil de Christian Oller | Profile photo of Christian Oller |
| H2 trayectoria | Mi Trayectoria | My Journey |
| H2 experiencia | Experiencia Profesional | Professional Experience |

**Párrafo de trayectoria** _(hardcoded en español en ambos locales)_:
"Soy un Desarrollador de Software con más de 2 años de experiencia. Mi enfoque combina la precisión técnica con la resolución creativa de problemas. Me he especializado en soluciones ERP, tecnología para aerolíneas y plataformas de consultoría medioambiental."

**Experiencia profesional:**

| Rol | Empresa | Período | Descripción | Tareas |
|---|---|---|---|---|
| FullStack Developer | Inology | Jun 2023 – Mar 2024 | Desarrollo de aplicaciones ERP y soluciones de gestión horaria. | Mantenimiento de ERP con SQL / Crystal Reports / Gestión de servidores / Consultoría directa con clientes |
| Front-end Developer | SM Medioambientales | Sep 2023 – Nov 2023 | Soluciones web para consultoría ambiental. | Mantenimiento y optimización web / Diseño UI (HTML/CSS/JS) / Rediseño completo de la plataforma / Refactorización a Tailwind/Bootstrap |
| Front-end Developer | Vueling Airlines | Mar 2023 – May 2023 | Innovación tecnológica y plataformas digitales para aerolíneas. | Desarrollo con Angular / TypeScript/JS / Apps de alto tráfico / Integración de APIs + testing con Postman |
| Front-end Developer | Pukkas | Ene 2022 – Ago 2022 | Desarrollo de proyectos web a medida. | Desarrollo de interfaces de usuario / Integración de APIs externas |

---

### Contacto

| Elemento | Español | Inglés |
|---|---|---|
| Meta title | Contacto \| Christian Oller | Contact \| Christian Oller |
| Meta description | ¿Tienes un proyecto en mente? Hablemos sobre cómo puedo ayudarte. | Have a project in mind? Let's talk about how I can help you. |
| H1 | Trabajemos juntos. | Let's work together. |
| Intro | ¿Interesado en empezar un proyecto? Actualmente estoy disponible para trabajos freelance y abierto a nuevas oportunidades profesionales. | Interested in starting a project? I'm currently available for freelance work and open to new professional opportunities. |
| Label email | Email | Email |
| Valor email | contacto@christianoller.com | contacto@christianoller.com |
| Label redes | Redes Sociales | Social Media |
| Redes | Twitter (X) / LinkedIn / Instagram | Twitter (X) / LinkedIn / Instagram |
| Label ubicación | Ubicación | Location |
| Valor ubicación | Córdoba, España | Córdoba, Spain |
| Campo: Nombre label | Nombre | Name |
| Campo: Nombre placeholder | Tu nombre | Your name |
| Campo: Email label | Email | Email |
| Campo: Email placeholder | tu@email.com | tu@email.com |
| Campo: Asunto label | Asunto | Subject |
| Campo: Asunto placeholder | Selecciona un tipo de proyecto | Select a project type |
| Opción 1 | Diseño UI/UX | UI/UX Design |
| Opción 2 | Identidad de Marca | Brand Identity |
| Opción 3 | Desarrollo Web | Web Development |
| Opción 4 | Otro | Other |
| Campo: Mensaje label | Mensaje | Message |
| Campo: Mensaje placeholder | Cuéntame un poco sobre tu proyecto... | Tell me a bit about your project... |
| Botón submit | Enviar Mensaje | Send Message |

---

### Proyectos (listado)

| Elemento | Español | Inglés |
|---|---|---|
| Meta title | Proyectos \| Christian Oller | Projects \| Christian Oller |
| Meta description | Una colección de trabajos en desarrollo full-stack, diseño UI/UX y arquitectura de software. | A collection of work in full-stack development, UI/UX design and software architecture. |
| H1 | Proyectos | Projects |
| Subheading | Una colección de trabajos en desarrollo full-stack, diseño UI/UX y arquitectura de software. | A collection of work in full-stack development, UI/UX design and software architecture. |
| CTA de tarjeta (sr-only) | Ver Proyecto | View Project |

---

### Footer (global)

> _(Hardcoded en inglés — no usa el sistema i18n)_

- **Copyright:** "© {año actual}. All rights reserved."
- **Links sociales:** X → `https://twitter.com` / GitHub → `https://github.com/christianoller8` / LinkedIn → `https://www.linkedin.com/in/christian-oller`

---

## Proyectos del portfolio

### Project 1 — EcoMarket Marketplace

| Campo | Valor |
|---|---|
| Slug | `project-1` |
| Año | 2024 |
| Cliente | EcoMarket Inc. |
| Tecnologías | Next.js, Stripe, Tailwind CSS, PostgreSQL |
| Destacado | ✅ Sí (aparece en homepage) |
| GitHub | `https://github.com/christianoller/ecomarket` |
| Descripción | Plataforma de comercio electrónico full-stack diseñada para conectar productores locales con consumidores conscientes. |

**Secciones del cuerpo:** El Desafío / Mi Rol / Resultado / Stack Tecnológico  
**Logro destacado:** Aumento del 150% en ventas en el primer trimestre. Lighthouse score: 98.

---

### Project 2 — TaskFlow Analytics

| Campo | Valor |
|---|---|
| Slug | `project-2` |
| Año | 2023 |
| Cliente | StartUp Flow |
| Tecnologías | React, TypeScript, D3.js, Firebase |
| Destacado | ✅ Sí (aparece en homepage) |

**Secciones del cuerpo:** Visión General / Implementación Técnica / Características Clave  
**Pull quote:** "La capacidad de visualizar los cuellos de botella en tiempo real cambió nuestra forma de trabajar." — CTO de StartUp Flow  
**Características clave:** Real-time Updates (Firebase Firestore) / Drag & Drop (Kanban) / Reportes PDF automatizados

---

### Project 3 — SkyLink Intranet

| Campo | Valor |
|---|---|
| Slug | `project-3` |
| Año | 2023 |
| Cliente | AeroGroup |
| Tecnologías | Angular, RxJS, SASS, API Rest |
| Destacado | ❌ No (solo aparece en `/projects`) |

**Secciones del cuerpo:** Contexto / Solución / Logros  
**Logro destacado:** Tiempo de carga reducido de 8s a 1.2s.

---

## Componentes

### Comunes (nivel layout)

**`Header.astro`**
- Barra sticky superior, `h-16`, `backdrop-blur-md`
- Desktop: 4 links de nav separados por `/` + selector ES/EN + ThemeToggle
- Mobile: hamburger que despliega un menú deslizable con los mismos links

**`Footer.astro`**
- Línea de copyright con año dinámico
- Links sociales: X, GitHub, LinkedIn

**`ThemeToggle.astro`**
- Botón con icono SVG de sol/luna según el modo activo
- Persiste preferencia en `localStorage.theme`
- Compatible con las transiciones de página de Astro via `astro:page-load`

### Landing

**`Hero.astro`** — Layout de 2 columnas: texto izquierda, retrato derecha  
**`Services.astro`** — Grid 4 columnas con tarjetas animadas (underline expand en hover)  
**`LogoGrid.astro`** — Grid 8 columnas con tiles que tienen fill deslizante en hover  
**`AboutSummary.astro`** — Layout 2 columnas: H2 serif izquierda, párrafos derecha  
**`FeaturedWork.astro`** — Grid 2 columnas de tarjetas con overlay en hover

### Páginas

**`AboutPage.astro`** — Grid 12 col: sidebar sticky (col-span-4) + contenido (col-span-8) con timeline  
**`ContactPage.astro`** — Grid 2 col (5fr/7fr): info izquierda + formulario en tarjeta derecha  
**`ProjectsPage.astro`** — H1 + subheading + grid 3 col de todas las tarjetas de proyectos  
**`ProjectPage.astro`** — Back link + H1 serif + barra de metadatos + imagen hero + prose Markdown

---

## Observaciones y deuda técnica

### Crítico

1. **Gap i18n en la landing:** Los componentes Hero, Services, LogoGrid, AboutSummary y FeaturedWork tienen texto hardcoded en español. Un usuario que visita `/en/` ve la homepage en español — la experiencia i18n está incompleta.

2. **Footer con texto hardcoded en inglés:** El archivo `src/i18n/ui.ts` tiene la clave `footer.rights` en ambos idiomas, pero `Footer.astro` no usa `useTranslations` — muestra "All rights reserved." siempre en inglés.

3. **URL del sitio es un placeholder:** `astro.config.mjs` tiene `site: 'https://midominio.com'` — esto afecta las URLs canónicas y las etiquetas Open Graph en producción.

### Importante

4. **Links sociales son placeholders:** El link de Twitter apunta a `https://twitter.com` (sin perfil). Instagram en la página de contacto apunta a `https://instagram.com`. Deben actualizarse con perfiles reales.

5. **Email de contacto:** `contacto@christianoller.com` — verificar que sea funcional y que el formulario tenga backend conectado.

6. **Párrafo de trayectoria no i18n-izado:** En `AboutPage.astro`, el párrafo del cuerpo "Soy un Desarrollador de Software con más de 2 años de experiencia..." está hardcoded en español y no responde al locale.

### Menor

7. **Project 3 no es featured:** SkyLink Intranet (`featured: false`) solo aparece en el listado de `/projects`. Si se quiere más exposición, cambiar a `featured: true`.

8. **No existe color de acento:** La paleta es totalmente monocromática. Si en el futuro se necesita un color de marca, hay que definirlo como token CSS y en el `@theme` de Tailwind.
