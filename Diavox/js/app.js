/**
 * Diavox - Aplicación principal
 * Inicializa y coordina todos los módulos
 */

(function() {
    'use strict';

    // Estado de la aplicación
    const state = {
        isGenerating: false,
        currentPresentation: null
    };

    // Elementos del DOM
    const elements = {};

    // Ejemplos predefinidos
    const examples = {
        academic: `# Inteligencia Artificial en la Educación Superior

## Introducción
La inteligencia artificial (IA) está transformando radicalmente el panorama educativo global. Las universidades y centros de formación están adoptando sistemas inteligentes para personalizar el aprendizaje, automatizar tareas administrativas y mejorar los resultados académicos.

## Beneficios Principales
- Personalización del aprendizaje adaptativo según el ritmo y estilo de cada estudiante
- Retroalimentación inmediata y automatizada en ejercicios y evaluaciones
- Accesibilidad mejorada para estudiantes con discapacidades mediante tecnologías de asistencia
- Análisis predictivo para identificar estudiantes en riesgo de abandono
- Escalabilidad de la educación de calidad a nivel global

## Desafíos y Consideraciones Éticas
La implementación de IA en educación plantea retos significativos que deben abordarse:

- **Privacidad de datos**: Protección de información sensible de estudiantes
- **Sesgo algorítmico**: Garantizar equidad en sistemas de evaluación automática
- **Brecha digital**: Riesgo de amplificar desigualdades existentes
- **Dependencia tecnológica**: Balance entre herramienta y sustituto del docente
- **Transparencia**: Explicabilidad de decisiones algorítmicas

## Metodología de Implementación
1. Auditoría de necesidades institucionales y capacidades técnicas
2. Selección de herramientas validadas pedagógicamente
3. Programa piloto con grupo control y métricas definidas
4. Capacitación docente continua y soporte técnico
5. Evaluación de impacto y escalado progresivo

## Conclusión
La IA no reemplaza al educador, sino que amplifica su capacidad de impactar positivamente en el aprendizaje. El futuro educativo reside en la simbiosis entre experiencia humana e inteligencia artificial.`,

        business: `# EcoMarket - Marketplace Sostenible

## Problema
Los consumidores conscientes luchan por encontrar productos verdaderamente sostenibles. El greenwashing es rampante, las certificaciones son confusas y no existe una plataforma centralizada que verifique la cadena de suministro completa.

## Solución
EcoMarket es una plataforma de comercio electrónico que conecta consumidores conscientes con marcas verificadamente sostenibles, utilizando blockchain para trazabilidad total de la cadena de suministro.

## Propuesta de Valor
- **Verificación blockchain**: Cada producto tiene un pasaporte digital inmutable
- **Curación experta**: Comité de sostenibilidad valida cada marca
- **Impacto medible**: Dashboard de huella de carbono por compra
- **Comunidad**: Foro de consumidores y marcas para co-creación

## Mercado Objetivo
- **TAM**: $150B (marketplace sostenible global 2030)
- **SAM**: $12B (consumidores conscientes LATAM y España)
- **SOM**: $50M (early adopters urbanos 25-40 años)

## Modelo de Negocio
- Comisión 15% por transacción (vs 30% Amazon)
- Suscripción marcas Premium: $299/mes (analytics + destacadas)
- Datos anonimizados de tendencias a industrias (opt-in)

## Tracción (6 meses)
- 2,400 usuarios registrados
- 180 marcas verificadas
- $180K GMV mensual
- 42% tasa de recompra
- NPS 68

## Equipo
- **CEO**: Ex-Director Sostenibilidad Unilever
- **CTO**: Ex-Lead Engineer MercadoLibre
- **CPO**: Ex-Product Manager Patagonia
- **Advisors**: Fundadores Too Good To Go, B Corp Latam

## Próximos Pasos
- Ronda Seed: $800K para expansión México y Colombia
- Lanzamiento app móvil Q2
- API para integración con ERPs de marcas`,

        educational: `# Módulo: Fundamentos de Programación Web

## Objetivos de Aprendizaje
Al finalizar esta sesión, los estudiantes podrán:
- Explicar la arquitectura cliente-servidor en la web
- Estructurar contenido semántico con HTML5
- Aplicar estilos modernos con CSS3 (Flexbox, Grid, Custom Properties)
- Implementar interactividad básica con JavaScript vanilla

## Contenidos

### 1. Cómo funciona la Web (15 min)
- Petición HTTP/HTTPS y respuesta
- DNS, servidores, navegadores
- DevTools: pestaña Network

### 2. HTML Semántico (25 min)
- Elementos de estructura: header, main, section, article, aside, footer
- Formularios accesibles: label, fieldset, legend, aria-*
- Multimedia: picture, video, audio con fallbacks

### 3. CSS Moderno (30 min)
- Custom Properties (variables CSS)
- Flexbox para componentes unidimensionales
- Grid para layouts bidimensionales
- Media queries y mobile-first
- Animaciones y transiciones suaves

### 4. JavaScript Esencial (30 min)
- Manipulación del DOM: querySelector, createElement, append
- Eventos: addEventListener, delegación, preventDefault
- Fetch API y async/await
- Módulos ES6: import/export

## Actividades Prácticas
1. **Ejercicio guiado**: Crear tarjeta de perfil responsiva (20 min)
2. **Trabajo en pares**: Formulario de contacto con validación (25 min)
3. **Mini-proyecto**: Landing page de un producto ficticio (40 min)

## Evaluación Formativa
- Autoevaluación con rúbrica al final de cada bloque
- Peer review del mini-proyecto (criterios: semántica, responsividad, JS)
- Ticket de salida: 3 conceptos clave + 1 duda

## Recursos
- MDN Web Docs (referencia oficial)
- web.dev (patrones modernos)
- Can I Use (compatibilidad)
- Repositorio de la clase: github.com/curso-web-fundamentos

## Próxima Sesión
Frameworks CSS (Tailwind) y introducción a TypeScript`,

        technical: `# Arquitectura de Microservicios - Guía Técnica

## Visión General
Sistema distribuido basado en microservicios para plataforma de e-commerce de alto tráfico. Diseñado para escalabilidad horizontal, resiliencia y despliegue independiente.

## Arquitectura del Sistema

### Servicios Core
| Servicio | Responsabilidad | Tech Stack | Escalabilidad |
|----------|----------------|------------|---------------|
| API Gateway | Routing, auth, rate limiting | Kong + Lua | Horizontal (stateless) |
| User Service | Autenticación, perfiles, roles | Go + gRPC | Horizontal + CQRS |
| Catalog Service | Productos, categorías, búsqueda | Node.js + Elasticsearch | Horizontal (read replicas) |
| Order Service | Carrito, checkout, pagos | Java Spring Boot | Saga pattern |
| Payment Service | Procesamiento pagos, webhooks | Python + Stripe SDK | Horizontal (idempotency) |
| Inventory Service | Stock, reservas, almacenes | Rust + Redis | Horizontal (sharding) |
| Notification Service | Email, push, SMS, in-app | Go + NATS | Horizontal (pub/sub) |

### Infraestructura
- **Orquestación**: Kubernetes (EKS/GKE)
- **Service Mesh**: Istio (mTLS, traffic splitting)
- **Observabilidad**: Prometheus + Grafana + Jaeger
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD**: GitLab CI + ArgoCD (GitOps)
- **Base de datos**: PostgreSQL (primaria), MongoDB (logs), Redis (cache)

## Patrones Implementados
- **Circuit Breaker**: Resilience4j / Hystrix-Go
- **Retry con Backoff**: Exponencial + jitter
- **Bulkhead**: Pool de conexiones por servicio
- **Event Sourcing**: Order Service (auditoría completa)
- **CQRS**: User Service (lectura/escritura separadas)
- **Saga Coreografiada**: Order → Payment → Inventory → Notification

## API Design
- RESTful con versionado en header (Accept: application/vnd.api+json;version=2)
- GraphQL Federation para consultas complejas (frontend)
- gRPC interno (protobuf) para comunicación servicio-servicio
- OpenAPI 3.1 specs en repositorio compartido

## Seguridad
- Zero Trust Architecture
- mTLS entre todos los servicios (Istio)
- JWT short-lived (15min) + refresh tokens rotativos
- Rate limiting adaptativo por IP y usuario
- WAF en API Gateway (OWASP Top 10)
- Secrets management: HashiCorp Vault

## Despliegue
- Blue/Green deployments via ArgoCD
- Canary releases con Istio (10% → 50% → 100%)
- Feature flags (LaunchDarkly)
- Rollback automático en métricas de error > 1%
- RTO: 5 min, RPO: 1 min

## Monitoreo Crítico
- **SLIs**: Latencia p99 < 200ms, Error rate < 0.1%, Disponibilidad 99.95%
- **Alertas**: PagerDuty (critical), Slack (warning)
- **Dashboards**: RED metrics (Rate, Errors, Duration) por servicio`,

        creative: `# "Aurora" - Colección Primavera 2025

## Concepto
Aurora nace de la observación de la luz al amanecer: esa transición mágica donde la oscuridad cede paso al color. La colección explora la dualidad entre sombra y luz, estructura y fluidez, lo efímero y lo permanente.

## Inspiración
- **Pintura**: J.M.W. Turner (luz atmosférica), Mark Rothko (campos de color)
- **Naturaleza**: Auroras boreales, iridiscencia en burbujas, pétalos translúcidos
- **Arquitectura**: Tadao Ando (juego de luz y concreto), Sou Fujimoto (transparencia)

## Paleta de Colores
| Nombre | Hex | Uso | Sensación |
|--------|-----|-----|-----------|
| Alba | #FFF8E7 | Base neutra cálida | Calma, pureza |
| Aurora Rosa | #F5C6CB | Acento principal | Optimismo, ternura |
| Cielo Crepuscular | #B8D4E3 | Secundario | Serenidad, profundidad |
| Verde Musgo | #8FBC8F | Detalle orgánico | Naturaleza, grounding |
| Negro Ónix | #1A1A2E | Estructura | Elegancia, misterio |

## Materiales
- **Seda orgánica certificada GOTS**: Fluidez, brillo natural
- **Lino belga**: Textura, transpirabilidad, mejora con uso
- **Tencel™ lyocell**: Drapeado, sostenible, biodegradable
- **Algodón regenerativo**: Estructura, durabilidad, carbono negativo
- **Detalles**: Botones de nácar, cierres invisibles, hilo de seda

## Siluetas Clave
1. **Vestido "Horizonte"**: Corte imperio, falda asimétrica, movimiento líquido
2. **Blusa "Primera Luz"**: Cuello alto, mangas globo, transparencias graduadas
3. **Pantalón "Zenit"**: Talle alto, pierna ancha, pliegues frontales
4. **Abrigo "Crepúsculo"**: Oversize, doble faz, cinturón de lazo

## Proceso Creativo
1. **Investigación** (4 semanas): Moodboards, investigación de materiales, testing de tintes
2. **Bocetos** (3 semanas): 120+ dibujos, selección de 24, refinamiento técnico
3. **Patronaje** (3 semanas): Toiles en muselina, ajustes en maniquí y cuerpo real
4. **Prototipos** (2 semanas): Prendas finales en materiales definitivos
5. **Sesión fotográfica**: Lookbook + video conceptual + contenido redes

## Sostenibilidad
- **Zero waste**: Patrones optimizados (85% eficiencia de tela)
- **Tintes naturales**: Índigo, rubia, granada, cáscara de nuez
- **Producción local**: Taller propio + 2 talleres certificados (radio 50km)
- **Packaging**: Cajas de semillas plantables, papel algodón reciclado
- **Circularidad**: Programa de reparación gratuita de por vida

## Lanzamiento
- **Fashion Week**: Presentación inmersiva (instalación lumínica + performance)
- **Pre-order**: 4 semanas (producción bajo demanda)
- **Entrega**: 8 semanas post-cierre pre-order
- **Comunicación**: Colaboración con 3 artistas visuales + 1 músico ambiental`,

        meeting: `# Reunión Trimestral Q1 2025 - Equipo Producto

## Asistentes
- **Facilitador**: María González (Product Lead)
- **Equipo**: Carlos (Dev Lead), Ana (UX Lead), Luis (Data), Pedro (Marketing), Sara (Support)
- **Invitados**: VP Engineering, CTO

## Agenda
1. **Bienvenida y objetivos** (5 min)
2. **Revisión OKRs Q1** (20 min)
3. **Demo de features lanzadas** (15 min)
4. **Retrospectiva: Qué funcionó / Qué mejorar** (20 min)
5. **Planificación Q2** (25 min)
6. **Riesgos y bloqueos** (10 min)
7. **Cierre y próximos pasos** (5 min)

## OKRs Q1 - Resultados

### OBJETIVO 1: Mejorar activación de usuarios nuevos
- **KR1**: Tasa activación 40% → 52% ✅ (54% logrado)
- **KR2**: Time-to-value < 10 min ✅ (7.3 min)
- **KR3**: Onboarding completion 65% → 78% ⚠️ (73%)

### OBJETIVO 2: Reducir churn mensual
- **KR1**: Churn 5.2% → 3.8% ✅ (3.5%)
- **KR2**: NPS 42 → 55 ✅ (58)
- **KR3**: Expansión revenue 15% ❌ (8%)

### OBJETIVO 3: Escalar infraestructura
- **KR1**: P99 latency < 200ms ✅ (180ms)
- **KR2**: Costo/usuario -20% ⚠️ (-12%)
- **KR3**: Zero downtime deployments ✅

## Features Lanzadas Q1
1. **Smart Onboarding v2** - Flujo adaptativo por rol (impacto: +11% activación)
2. **Dashboard Analytics Pro** - Métricas en tiempo real (adopción: 34% users)
3. **Integración Slack/MS Teams** - Notificaciones contextuales (NPS +12 pts)
4. **API Webhooks v2** - Confiabilidad 99.9% (15 partners activos)
5. **Modo Oscuro** - Request #1 usuarios (adopción 67%)

## Retrospectiva

### ✅ Qué Funcionó Bien
- Planning poker mejoró estimaciones (precisión +40%)
- Pair programming obligatorio en features críticas (bugs -60%)
- Office hours semanales con Support (feedback loop cerrado)
- Feature flags para rollout gradual (cero incidentes graves)

### ⚠️ Qué Mejorar
- Deuda técnica en User Service (refactor pendiente 3 sprints)
- Comunicación async: decisiones en Slack sin documentar
- Testing E2E cobertura 45% (objetivo 70%)
- Dependencias cross-team no mapeadas (bloqueos imprevistos)

## Planificación Q2 - Prioridades

### P0 (Crítico)
1. **Refactor User Service** - Migración a arquitectura hexagonal (8 semanas)
2. **Checkout Unificado** - Single flow multi-producto (6 semanas)
3. **Testing E2E Framework** - Cypress + contract testing (4 semanas)

### P1 (Alto)
4. **Mobile App MVP** - React Native (12 semanas)
5. **Self-serve Billing Portal** - Stripe Billing integration (5 semanas)
6. **AI-Powered Recommendations** - Colaboración Data Team (8 semanas)

### P2 (Medio)
7. **Design System v2** - Tokens + componentes React (6 semanas)
8. **Internacionalización i18n** - ES, EN, PT, FR (4 semanas)

## Riesgos y Bloqueos
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Rotación devs senior | Media | Alto | Retención + knowledge sharing |
| Migración User Service retrasa Q2 | Alta | Crítico | Paralelizar con contractor |
| API Stripe breaking changes | Baja | Medio | Version pinning + tests |
| Budget Q2 no aprobado | Media | Alto | Priorización P0 only |

## Decisiones Tomadas
1. ✅ Aprobar refactor User Service como P0
2. ✅ Contratar 2 contractors para paralelar refactor
3. ✅ Postergar Mobile App a Q3 (depende de User Service)
4. ✅ Invertir en E2E testing antes que features nuevas

## Action Items
| Acción | Responsable | Fecha Límite | Estado |
|--------|-------------|--------------|--------|
| Especificación técnica User Service v2 | Carlos | 15/04 | 🟡 En progreso |
| Contratación contractors | María + RRHH | 30/04 | 🔴 Pendiente |
| Setup Cypress + contract tests | Luis | 20/04 | 🟡 En progreso |
| Documentar decisiones en Notion | Ana | 10/04 | 🟢 Hecho |
| Revisar budget Q2 con CFO | María | 25/04 | 🟡 En progreso |

## Próxima Reunión
**Sprint Planning Q2 Sprint 1** - Lunes 7 Abril, 10:00h
Duración: 2 horas | Preparación: Leer specs User Service v2`,

        default: `# Bienvenido a Diavox

## Introducción
Diavox es una herramienta que convierte tu texto en presentaciones visuales profesionales al instante. Solo escribe tu contenido y deja que Diavox haga el resto.

## Cómo Funciona
- Escribe o pega tu texto en el área de contenido
- Usa **#** para títulos principales
- Usa **##** para subtítulos
- Usa **guiones (-)** o **asteriscos (*)** para listas
- Haz clic en "Generar presentación"

## Características
- **6+ diseños de diapositivas** distintos y coherentes
- **Modo presentación** a pantalla completa con controles de teclado
- **Edición en vivo** de cualquier diapositiva
- **Exportación a PDF** via impresión del navegador
- **100% offline** - tus datos nunca salen de tu navegador
- **Responsive** - funciona en móvil, tablet y escritorio

## Ejemplos de Uso
- Presentaciones académicas y tesis
- Pitch decks para startups
- Clases y material educativo
- Documentación técnica
- Propuestas creativas
- Actas de reuniones

## Atajos de Teclado (Modo Presentación)
- **→ / Espacio / PgDown**: Siguiente diapositiva
- **← / PgUp**: Diapositiva anterior
- **Home / Fin**: Primera / Última diapositiva
- **Esc**: Salir presentación
- **F**: Pantalla completa

---

*Proyecto académico - Jose Caceres Aramayo & Carlos Fabrizhio Chavarria Pereyra*`
    };

    /**
     * Inicializa la aplicación
     */
    function init() {
        cacheElements();
        bindEvents();
        setupPreviewAnimation();
        loadDefaultExample();

        // Exponer API global para debugging
        window.DiavoxApp = {
            showToast,
            getState: () => state,
            exportToPDF: () => PresentationMode.exportToPDF()
        };
    }

    /**
     * Cachea referencias a elementos del DOM
     */
    function cacheElements() {
        // Navbar
        elements.navToggle = document.querySelector('.nav-toggle');
        elements.navLinks = document.querySelector('.nav-links');
        elements.navLinksList = document.querySelectorAll('.nav-link');

        // Generador
        elements.contentInput = document.getElementById('content-input');
        elements.charCount = document.getElementById('char-count');
        elements.generateBtn = document.getElementById('generate-btn');
        elements.clearBtn = document.getElementById('clear-btn');
        elements.loadExampleBtn = document.getElementById('load-example-btn');
        elements.errorMessage = document.getElementById('error-message');
        elements.previewPanel = document.querySelector('.preview-panel');

        // Navegación slides
        elements.prevSlide = document.getElementById('prev-slide');
        elements.nextSlide = document.getElementById('next-slide');
        elements.currentSlide = document.getElementById('current-slide');
        elements.totalSlides = document.getElementById('total-slides');
        elements.slideContainer = document.getElementById('slide-container');
        elements.emptyState = document.getElementById('empty-state');
        elements.thumbnailsList = document.getElementById('thumbnails-list');
        elements.toggleThumbnails = document.getElementById('toggle-thumbnails');

        // Botones de acción
        elements.editModeBtn = document.getElementById('edit-mode-btn');
        elements.presentBtn = document.getElementById('present-btn');
        elements.exportBtn = document.getElementById('export-btn');

        // Modal edición
        elements.editModal = document.getElementById('edit-modal');
        elements.editForm = document.getElementById('edit-form');
        elements.editSlideTitle = document.getElementById('edit-slide-title');
        elements.editSlideContent = document.getElementById('edit-slide-content');
        elements.editSlideType = document.getElementById('edit-slide-type');
        elements.closeEditModal = document.getElementById('close-edit-modal');
        elements.cancelEdit = document.getElementById('cancel-edit');

        // Modo presentación
        elements.presPrev = document.getElementById('pres-prev');
        elements.presNext = document.getElementById('pres-next');
        elements.presCurrent = document.getElementById('pres-current');
        elements.presTotal = document.getElementById('pres-total');
        elements.presExit = document.getElementById('pres-exit');

        // Ejemplos
        elements.exampleCards = document.querySelectorAll('.load-example');

        // Toast container
        elements.toastContainer = document.getElementById('toast-container');
    }

    /**
     * Vincula eventos
     */
    function bindEvents() {
        // Navbar toggle
        elements.navToggle?.addEventListener('click', toggleMobileNav);
        elements.navLinksList.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Cerrar nav mobile al hacer scroll
        window.addEventListener('scroll', () => {
            if (elements.navLinks?.classList.contains('open')) {
                closeMobileNav();
            }
        });

        // Contador de caracteres
        elements.contentInput?.addEventListener('input', updateCharCount);

        // Generar presentación
        elements.generateBtn?.addEventListener('click', handleGenerate);

        // Limpiar
        elements.clearBtn?.addEventListener('click', handleClear);

        // Cargar ejemplo
        elements.loadExampleBtn?.addEventListener('click', () => showExamplePicker());
        elements.exampleCards.forEach(btn => {
            btn.addEventListener('click', (e) => loadExample(e.target.dataset.example));
        });

        // Navegación slides
        elements.prevSlide?.addEventListener('click', () => PresentationMode.goToPrevious());
        elements.nextSlide?.addEventListener('click', () => PresentationMode.goToNext());

        // Botones acción
        elements.editModeBtn?.addEventListener('click', toggleEditMode);
        elements.presentBtn?.addEventListener('click', () => PresentationMode.enterPresentationMode());
        elements.exportBtn?.addEventListener('click', () => PresentationMode.exportToPDF());

        // Miniaturas toggle
        elements.toggleThumbnails?.addEventListener('click', toggleThumbnails);

        // Teclado global
        document.addEventListener('keydown', handleGlobalKeydown);
    }

    /**
     * Alterna menú móvil
     */
    function toggleMobileNav() {
        const isOpen = elements.navLinks.classList.toggle('open');
        elements.navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileNav() {
        elements.navLinks.classList.remove('open');
        elements.navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /**
     * Maneja clic en navegación
     */
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            closeMobileNav();
            updateActiveNav(targetId);
        }
    }

    function updateActiveNav(sectionId) {
        elements.navLinksList.forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
    }

    /**
     * Actualiza contador de caracteres
     */
    function updateCharCount() {
        const count = elements.contentInput.value.length;
        elements.charCount.textContent = count.toLocaleString();
    }

    /**
     * Maneja generación de presentación
     */
    async function handleGenerate() {
        const content = elements.contentInput.value.trim();

        if (!content) {
            showError('Por favor, escribe o pega algún contenido para generar la presentación.');
            elements.contentInput.focus();
            return;
        }

        if (content.length < 10) {
            showError('El contenido es muy corto. Añade más texto para generar diapositivas significativas.');
            elements.contentInput.focus();
            return;
        }

        setGenerating(true);
        hideError();

        try {
            // Simular procesamiento (pequeño delay para UX)
            await new Promise(resolve => setTimeout(resolve, 300));

            const presentation = SlideGenerator.generate(content);
            state.currentPresentation = presentation;

            // Pasar a PresentationMode
            PresentationMode.setSlides(presentation.slides, {
                title: presentation.title,
                subtitle: presentation.subtitle
            });

            // Mostrar panel de vista previa
            elements.previewPanel.hidden = false;
            elements.previewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

            showToast(`Presentación generada: ${presentation.totalSlides} diapositivas`, 'success');

        } catch (error) {
            console.error('Error generating presentation:', error);
            showError(error.message || 'Error al generar la presentación. Intenta de nuevo.');
        } finally {
            setGenerating(false);
        }
    }

    function setGenerating(isGenerating) {
        state.isGenerating = isGenerating;
        elements.generateBtn.classList.toggle('loading', isGenerating);
        elements.generateBtn.disabled = isGenerating;
        elements.generateBtn.querySelector('.btn-text').textContent = isGenerating ? 'Generando...' : 'Generar presentación';
    }

    /**
     * Maneja limpiar contenido
     */
    function handleClear() {
        if (elements.contentInput.value.trim() && !confirm('¿Borrar todo el contenido?')) {
            return;
        }
        elements.contentInput.value = '';
        updateCharCount();
        elements.contentInput.focus();
        hideError();

        // Resetear vista previa
        PresentationMode.setSlides([]);
        elements.previewPanel.hidden = true;
        elements.emptyState.hidden = false;
        elements.slideContainer.hidden = true;
    }

    /**
     * Muestra selector de ejemplos
     */
    function showExamplePicker() {
        // Scroll a sección ejemplos
        const examplesSection = document.getElementById('ejemplos');
        if (examplesSection) {
            examplesSection.scrollIntoView({ behavior: 'smooth' });
            // Highlight temporal
            examplesSection.style.boxShadow = '0 0 0 3px var(--color-primary)';
            setTimeout(() => examplesSection.style.boxShadow = '', 1500);
        }
    }

    /**
     * Carga un ejemplo predefinido
     */
    function loadExample(key) {
        const content = examples[key] || examples.default;
        elements.contentInput.value = content;
        updateCharCount();
        hideError();
        elements.contentInput.focus();

        // Scroll al generador
        document.getElementById('generador').scrollIntoView({ behavior: 'smooth' });

        showToast(`Ejemplo "${key}" cargado`, 'info');
    }

    /**
     * Carga ejemplo por defecto al inicio
     */
    function loadDefaultExample() {
        elements.contentInput.value = examples.default;
        updateCharCount();
    }

    /**
     * Alterna modo edición
     */
    function toggleEditMode() {
        const isEditing = elements.editModeBtn.getAttribute('aria-pressed') === 'true';
        elements.editModeBtn.setAttribute('aria-pressed', !isEditing);
        elements.editModeBtn.innerHTML = isEditing
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Editar'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><path d="M15 5l4 4"/><path d="M21 3l-4 4"/>';
        showToast(isEditing ? 'Modo vista' : 'Modo edición activado', 'info');
    }

    /**
     * Alterna visibilidad de miniaturas
     */
    function toggleThumbnails() {
        const thumbnailsList = elements.thumbnailsList;
        const isExpanded = elements.toggleThumbnails.getAttribute('aria-expanded') === 'true';

        elements.toggleThumbnails.setAttribute('aria-expanded', !isExpanded);
        elements.toggleThumbnails.innerHTML = isExpanded
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>';

        thumbnailsList.style.display = isExpanded ? 'none' : 'flex';
    }

    /**
     * Maneja teclado global
     */
    function handleGlobalKeydown(e) {
        // Escape cierra modales
        if (e.key === 'Escape') {
            if (elements.editModal?.open) {
                PresentationMode.closeEditModal();
            }
        }
    }

    /**
     * Muestra error
     */
    function showError(message) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.hidden = false;
        elements.contentInput.setAttribute('aria-invalid', 'true');
        elements.contentInput.style.borderColor = 'var(--color-error)';
    }

    function hideError() {
        elements.errorMessage.hidden = true;
        elements.contentInput.removeAttribute('aria-invalid');
        elements.contentInput.style.borderColor = '';
    }

    /**
     * Toast notifications
     */
    function showToast(message, type = 'info') {
        const container = elements.toastContainer;
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button class="toast-close" aria-label="Cerrar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));

        container.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => removeToast(toast), 5000);
    }

    function removeToast(toast) {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Animación de preview en hero
     */
    function setupPreviewAnimation() {
        const dots = document.querySelectorAll('.preview-dot');
        const slides = document.querySelectorAll('.preview-slide');
        let current = 0;

        function showSlide(index) {
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            slides.forEach((s, i) => s.classList.toggle('active', i === index));
        }

        function nextSlide() {
            current = (current + 1) % slides.length;
            showSlide(current);
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                current = i;
                showSlide(current);
            });
        });

        setInterval(nextSlide, 4000);
    }

    // Observador de scroll para actualizar nav activa
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id) {
                updateActiveNav(entry.target.id);
            }
        });
    }, { rootMargin: '-100px 0px -66%', threshold: 0.1 });

    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    // Inicializar módulo de presentación
    PresentationMode.init({
        prevBtn: elements.prevSlide,
        nextBtn: elements.nextSlide,
        currentEl: elements.currentSlide,
        totalEl: elements.totalSlides,
        presPrev: elements.presPrev,
        presNext: elements.presNext,
        presCurrent: elements.presCurrent,
        presTotal: elements.presTotal,
        presExit: elements.presExit,
        editModal: elements.editModal,
        editForm: elements.editForm,
        editSlideTitle: elements.editSlideTitle,
        editSlideContent: elements.editSlideContent,
        editSlideType: elements.editSlideType,
        closeEditModal: elements.closeEditModal,
        cancelEdit: elements.cancelEdit,
        thumbnailsList: elements.thumbnailsList,
        slideContainer: elements.slideContainer
    });

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();