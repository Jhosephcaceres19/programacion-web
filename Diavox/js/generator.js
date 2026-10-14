/**
 * Diavox - Generador de presentaciones
 * Convierte texto estructurado en diapositivas usando reglas de procesamiento
 */

const SlideGenerator = (function() {
    'use strict';

    // Tipos de diapositivas disponibles
    const SLIDE_TYPES = {
        COVER: 'cover',
        CONTENT: 'content',
        BULLET_LIST: 'bullet-list',
        TWO_COLUMN: 'two-column',
        CONCLUSION: 'conclusion',
        SECTION: 'section'
    };

    // Patrones de detección
    const PATTERNS = {
        // Títulos principales (# )
        h1: /^#\s+(.+)$/,
        // Subtítulos (## )
        h2: /^##\s+(.+)$/,
        // Sub-subtítulos (### )
        h3: /^###\s+(.+)$/,
        // Listas con guión o asterisco
        bullet: /^[\-\*]\s+(.+)$/,
        // Listas numeradas
        numbered: /^\d+[\.\)]\s+(.+)$/,
        // Separadores horizontales
        hr: /^---+$/,
        // Bloques de código
        codeBlock: /^```/,
        // Tablas simples
        table: /^\|.+\|$/
    };

    // Palabras clave para detectar tipos de contenido
    const KEYWORDS = {
        introduction: ['introducción', 'introduccion', 'introduction', 'inicio', 'comienzo', 'presentación', 'presentacion'],
        conclusion: ['conclusión', 'conclusion', 'conclusiones', 'cierre', 'final', 'resumen', 'en resumen'],
        section: ['sección', 'seccion', 'parte', 'capítulo', 'capitulo', 'módulo', 'modulo', 'tema'],
        methodology: ['metodología', 'metodologia', 'método', 'metodo', 'enfoque', 'approach'],
        results: ['resultados', 'resultados', 'hallazgos', 'findings', 'evidencia'],
        discussion: ['discusión', 'discusion', 'análisis', 'analisis', 'interpretación', 'interpretacion'],
        references: ['referencias', 'bibliografía', 'bibliografia', 'referencias', 'citaciones'],
        agenda: ['agenda', 'orden del día', 'orden del dia', 'puntos a tratar'],
        objectives: ['objetivos', 'objetivo', 'metas', 'goals', 'propósitos', 'propositos'],
        problem: ['problema', 'problemática', 'problematica', 'reto', 'desafío', 'desafio', 'challenge'],
        solution: ['solución', 'solucion', 'propuesta', 'propuesta de valor', 'value proposition'],
        market: ['mercado', 'market', 'tamaño de mercado', 'market size', 'público objetivo', 'publico objetivo'],
        team: ['equipo', 'team', 'integrantes', 'miembros', 'fundadores', 'founders'],
        timeline: ['cronograma', 'timeline', 'planificación', 'planificacion', 'hitos', 'milestones'],
        budget: ['presupuesto', 'budget', 'costos', 'costes', 'inversión', 'inversion'],
        risks: ['riesgos', 'risks', 'amenazas', 'threats', 'mitigación', 'mitigacion'],
        benefits: ['beneficios', 'benefits', 'ventajas', 'advantages', 'valor'],
        features: ['características', 'caracteristicas', 'funcionalidades', 'features', 'funciones'],
        architecture: ['arquitectura', 'architecture', 'diseño del sistema', 'diseno del sistema', 'system design'],
        api: ['api', 'endpoint', 'endpoints', 'interfaz', 'interface'],
        deployment: ['despliegue', 'deployment', 'producción', 'produccion', 'ci/cd', 'ci cd'],
        testing: ['pruebas', 'testing', 'tests', 'testeo', 'qa', 'calidad'],
        examples: ['ejemplos', 'examples', 'casos de uso', 'use cases', 'demo'],
        nextSteps: ['próximos pasos', 'proximos pasos', 'next steps', 'siguientes pasos', 'acciones', 'action items']
    };

    /**
     * Escapa HTML para prevenir XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Normaliza texto: trim, colapsa espacios múltiples
     */
    function normalizeText(text) {
        return text
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .trim()
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n');
    }

    /**
     * Divide el texto en bloques lógicos (párrafos, listas, etc.)
     */
    function parseBlocks(text) {
        const normalized = normalizeText(text);
        const lines = normalized.split('\n');
        const blocks = [];
        let currentBlock = { type: 'paragraph', lines: [] };
        let inCodeBlock = false;
        let codeBlockLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Bloques de código
            if (PATTERNS.codeBlock.test(trimmed)) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockLines = [];
                } else {
                    inCodeBlock = false;
                    if (currentBlock.lines.length > 0) {
                        blocks.push({ ...currentBlock });
                        currentBlock = { type: 'paragraph', lines: [] };
                    }
                    blocks.push({ type: 'code', content: codeBlockLines.join('\n') });
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockLines.push(line);
                continue;
            }

            // Línea vacía = fin de bloque
            if (trimmed === '') {
                if (currentBlock.lines.length > 0) {
                    blocks.push({ ...currentBlock });
                    currentBlock = { type: 'paragraph', lines: [] };
                }
                continue;
            }

            // Detectar tipo de línea
            if (PATTERNS.h1.test(trimmed)) {
                if (currentBlock.lines.length > 0) {
                    blocks.push({ ...currentBlock });
                }
                blocks.push({ type: 'h1', content: trimmed.replace(PATTERNS.h1, '$1') });
                currentBlock = { type: 'paragraph', lines: [] };
            } else if (PATTERNS.h2.test(trimmed)) {
                if (currentBlock.lines.length > 0) {
                    blocks.push({ ...currentBlock });
                }
                blocks.push({ type: 'h2', content: trimmed.replace(PATTERNS.h2, '$1') });
                currentBlock = { type: 'paragraph', lines: [] };
            } else if (PATTERNS.h3.test(trimmed)) {
                if (currentBlock.lines.length > 0) {
                    blocks.push({ ...currentBlock });
                }
                blocks.push({ type: 'h3', content: trimmed.replace(PATTERNS.h3, '$1') });
                currentBlock = { type: 'paragraph', lines: [] };
            } else if (PATTERNS.bullet.test(trimmed) || PATTERNS.numbered.test(trimmed)) {
                if (currentBlock.type !== 'list') {
                    if (currentBlock.lines.length > 0) {
                        blocks.push({ ...currentBlock });
                    }
                    currentBlock = { type: 'list', lines: [], items: [] };
                }
                const itemText = trimmed.replace(PATTERNS.bullet, '$1').replace(PATTERNS.numbered, '$1');
                currentBlock.items.push(itemText);
                currentBlock.lines.push(line);
            } else if (PATTERNS.hr.test(trimmed)) {
                if (currentBlock.lines.length > 0) {
                    blocks.push({ ...currentBlock });
                }
                blocks.push({ type: 'hr' });
                currentBlock = { type: 'paragraph', lines: [] };
            } else if (PATTERNS.table.test(trimmed)) {
                if (currentBlock.type !== 'table') {
                    if (currentBlock.lines.length > 0) {
                        blocks.push({ ...currentBlock });
                    }
                    currentBlock = { type: 'table', lines: [] };
                }
                currentBlock.lines.push(line);
            } else {
                // Línea normal de párrafo
                if (currentBlock.type !== 'paragraph') {
                    if (currentBlock.lines.length > 0) {
                        blocks.push({ ...currentBlock });
                    }
                    currentBlock = { type: 'paragraph', lines: [] };
                }
                currentBlock.lines.push(line);
            }
        }

        // Último bloque
        if (currentBlock.lines.length > 0) {
            blocks.push({ ...currentBlock });
        }

        return blocks;
    }

    /**
     * Detecta el tema principal del texto
     */
    function detectTopic(blocks) {
        const h1Blocks = blocks.filter(b => b.type === 'h1');
        if (h1Blocks.length > 0) {
            return h1Blocks[0].content;
        }

        // Buscar primera línea significativa
        for (const block of blocks) {
            if (block.type === 'paragraph' && block.lines.length > 0) {
                const firstLine = block.lines[0].trim();
                if (firstLine.length > 5) {
                    return firstLine.length > 80 ? firstLine.substring(0, 77) + '...' : firstLine;
                }
            }
        }

        return 'Presentación sin título';
    }

    /**
     * Detecta subtítulo del texto
     */
    function detectSubtitle(blocks, topic) {
        const h2Blocks = blocks.filter(b => b.type === 'h2');
        if (h2Blocks.length > 0) {
            return h2Blocks[0].content;
        }

        // Buscar primer párrafo después del título
        let foundTopic = false;
        for (const block of blocks) {
            if (block.type === 'h1') {
                foundTopic = true;
                continue;
            }
            if (foundTopic && block.type === 'paragraph' && block.lines.length > 0) {
                const text = block.lines.join(' ').trim();
                return text.length > 120 ? text.substring(0, 117) + '...' : text;
            }
        }

        return 'Generada automáticamente con Diavox';
    }

    /**
     * Clasifica un bloque de contenido para determinar tipo de diapositiva
     */
    function classifyBlock(block, index, allBlocks) {
        // Bloques de título principal -> Portada
        if (block.type === 'h1' && index === 0) {
            return SLIDE_TYPES.COVER;
        }

        // Separadores -> Separador de sección
        if (block.type === 'hr') {
            return SLIDE_TYPES.SECTION;
        }

        // Listas largas -> Lista de puntos
        if (block.type === 'list' && block.items.length >= 3) {
            return SLIDE_TYPES.BULLET_LIST;
        }

        // Bloques con h2 que parecen secciones
        if (block.type === 'h2') {
            const content = block.content.toLowerCase();
            for (const [category, keywords] of Object.entries(KEYWORDS)) {
                if (keywords.some(k => content.includes(k))) {
                    if (category === 'conclusion') return SLIDE_TYPES.CONCLUSION;
                    if (category === 'section') return SLIDE_TYPES.SECTION;
                    return SLIDE_TYPES.CONTENT;
                }
            }
        }

        // Párrafos largos -> Contenido
        if (block.type === 'paragraph') {
            const totalText = block.lines.join(' ').trim();
            if (totalText.length > 200) {
                return SLIDE_TYPES.CONTENT;
            }
        }

        // Por defecto contenido
        return SLIDE_TYPES.CONTENT;
    }

    /**
     * Agrupa bloques en diapositivas coherentes
     */
    function groupIntoSlides(blocks) {
        const slides = [];
        let currentSlide = { blocks: [], type: null };

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const slideType = classifyBlock(block, i, blocks);

            // Si es un separador o cambio de tipo fuerte, crear nueva diapositiva
            const isNewSection = block.type === 'hr' ||
                (block.type === 'h1' && i > 0) ||
                (block.type === 'h2' && currentSlide.blocks.length > 0 &&
                 !currentSlide.blocks.some(b => b.type === 'h2'));

            if (isNewSection && currentSlide.blocks.length > 0) {
                slides.push({ ...currentSlide });
                currentSlide = { blocks: [], type: null };
            }

            currentSlide.blocks.push(block);
            currentSlide.type = slideType;
        }

        if (currentSlide.blocks.length > 0) {
            slides.push(currentSlide);
        }

        // Post-procesamiento: asegurar que tenemos portada y conclusión
        return ensureStructure(slides);
    }

    /**
     * Asegura estructura mínima: portada, contenido, conclusión
     */
    function ensureStructure(slides) {
        if (slides.length === 0) {
            return [{
                type: SLIDE_TYPES.COVER,
                blocks: [{ type: 'paragraph', lines: ['Presentación vacía'] }]
            }];
        }

        // Verificar portada
        const hasCover = slides.some(s => s.type === SLIDE_TYPES.COVER);
        if (!hasCover && slides[0].blocks.some(b => b.type === 'h1')) {
            slides[0].type = SLIDE_TYPES.COVER;
        } else if (!hasCover) {
            // Crear portada genérica
            slides.unshift({
                type: SLIDE_TYPES.COVER,
                blocks: [
                    { type: 'h1', content: 'Presentación' },
                    { type: 'paragraph', lines: ['Generada con Diavox'] }
                ]
            });
        }

        // Verificar conclusión
        const hasConclusion = slides.some(s => s.type === SLIDE_TYPES.CONCLUSION);
        if (!hasConclusion && slides.length > 1) {
            slides.push({
                type: SLIDE_TYPES.CONCLUSION,
                blocks: [
                    { type: 'h2', content: 'Conclusión' },
                    { type: 'paragraph', lines: ['Gracias por su atención.'] }
                ]
            });
        }

        // Limitar número de diapositivas (máx 20)
        if (slides.length > 20) {
            // Fusionar diapositivas del medio
            const keep = 18;
            const middle = slides.slice(1, -1);
            const merged = [];
            for (let i = 0; i < middle.length; i += Math.ceil(middle.length / (keep - 2))) {
                const chunk = middle.slice(i, i + Math.ceil(middle.length / (keep - 2)));
                merged.push({
                    type: SLIDE_TYPES.CONTENT,
                    blocks: chunk.flatMap(s => s.blocks)
                });
            }
            return [slides[0], ...merged, slides[slides.length - 1]];
        }

        return slides;
    }

    /**
     * Genera contenido HTML para una diapositiva según su tipo
     */
    function renderSlide(slide, index, total) {
        const { type, blocks } = slide;

        switch (type) {
            case SLIDE_TYPES.COVER:
                return renderCoverSlide(blocks, index, total);
            case SLIDE_TYPES.BULLET_LIST:
                return renderBulletListSlide(blocks, index, total);
            case SLIDE_TYPES.TWO_COLUMN:
                return renderTwoColumnSlide(blocks, index, total);
            case SLIDE_TYPES.CONCLUSION:
                return renderConclusionSlide(blocks, index, total);
            case SLIDE_TYPES.SECTION:
                return renderSectionSlide(blocks, index, total);
            case SLIDE_TYPES.CONTENT:
            default:
                return renderContentSlide(blocks, index, total);
        }
    }

    function renderCoverSlide(blocks, index, total) {
        let title = 'Título de la presentación';
        let subtitle = 'Subtítulo descriptivo';

        for (const block of blocks) {
            if (block.type === 'h1') title = escapeHtml(block.content);
            else if (block.type === 'h2') subtitle = escapeHtml(block.content);
            else if (block.type === 'paragraph' && !subtitle.includes('Generada')) {
                subtitle = escapeHtml(block.lines.join(' ').substring(0, 150));
            }
        }

        return `
            <div class="rendered-slide slide-cover" data-slide-index="${index}" data-slide-type="cover">
                <header class="slide-header">
                    <div>
                        <h1 class="slide-title">${title}</h1>
                        <p class="slide-subtitle">${subtitle}</p>
                    </div>
                </header>
            </div>
        `;
    }

    function renderContentSlide(blocks, index, total) {
        let title = '';
        let contentParts = [];

        for (const block of blocks) {
            if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
                if (!title) {
                    title = escapeHtml(block.content);
                } else {
                    contentParts.push(`<h4>${escapeHtml(block.content)}</h4>`);
                }
            } else if (block.type === 'paragraph') {
                const text = escapeHtml(block.lines.join(' '));
                if (text) contentParts.push(`<p>${text}</p>`);
            } else if (block.type === 'list') {
                const items = block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
                contentParts.push(`<ul>${items}</ul>`);
            } else if (block.type === 'code') {
                contentParts.push(`<pre><code>${escapeHtml(block.content)}</code></pre>`);
            }
        }

        if (!title && contentParts.length > 0) {
            // Buscar primera frase como título
            const firstText = contentParts[0].replace(/<[^>]+>/g, '');
            if (firstText.length < 80) {
                title = firstText;
                contentParts.shift();
            } else {
                title = 'Contenido';
            }
        }

        return `
            <div class="rendered-slide slide-content" data-slide-index="${index}" data-slide-type="content">
                <header class="slide-header">
                    <div>
                        ${title ? `<h2 class="slide-title">${title}</h2>` : ''}
                    </div>
                    <div class="slide-actions">
                        <button class="slide-action-btn edit-slide" aria-label="Editar diapositiva" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="slide-action-btn delete-slide" aria-label="Eliminar diapositiva" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </header>
                <div class="slide-body">
                    <div class="slide-content-text">
                        ${contentParts.join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function renderBulletListSlide(blocks, index, total) {
        let title = 'Puntos clave';
        const allItems = [];

        for (const block of blocks) {
            if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
                if (!title || title === 'Puntos clave') {
                    title = escapeHtml(block.content);
                }
            } else if (block.type === 'list') {
                allItems.push(...block.items);
            } else if (block.type === 'paragraph') {
                // Convertir párrafo en ítem de lista
                allItems.push(block.lines.join(' '));
            }
        }

        const itemsHtml = allItems.slice(0, 10).map((item, i) => `
            <div class="bullet-item">
                <span class="bullet-marker">${i + 1}</span>
                <span class="bullet-text">${escapeHtml(item)}</span>
            </div>
        `).join('');

        return `
            <div class="rendered-slide slide-bullet-list" data-slide-index="${index}" data-slide-type="bullet-list">
                <header class="slide-header">
                    <div>
                        <h2 class="slide-title">${title}</h2>
                    </div>
                    <div class="slide-actions">
                        <button class="slide-action-btn edit-slide" aria-label="Editar diapositiva" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="slide-action-btn delete-slide" aria-label="Eliminar diapositiva" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </header>
                <div class="slide-body">
                    <div class="bullet-list">
                        ${itemsHtml}
                    </div>
                </div>
            </div>
        `;
    }

    function renderTwoColumnSlide(blocks, index, total) {
        let title = 'Comparación';
        let leftTitle = 'Columna izquierda';
        let leftContent = '';
        let rightTitle = 'Columna derecha';
        let rightContent = '';

        let column = 0;
        for (const block of blocks) {
            if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
                if (!title || title === 'Comparación') {
                    title = escapeHtml(block.content);
                } else if (column === 0) {
                    leftTitle = escapeHtml(block.content);
                } else {
                    rightTitle = escapeHtml(block.content);
                }
            } else if (block.type === 'paragraph') {
                const text = escapeHtml(block.lines.join(' '));
                if (column === 0) {
                    leftContent += `<p>${text}</p>`;
                } else {
                    rightContent += `<p>${text}</p>`;
                }
            } else if (block.type === 'list') {
                const items = block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
                if (column === 0) {
                    leftContent += `<ul>${items}</ul>`;
                } else {
                    rightContent += `<ul>${items}</ul>`;
                }
            } else if (block.type === 'hr') {
                column = 1;
            }
        }

        // Si no hay división clara, dividir a la mitad
        if (!rightContent && leftContent) {
            const paragraphs = leftContent.split('</p>').filter(p => p.trim());
            const mid = Math.ceil(paragraphs.length / 2);
            rightContent = paragraphs.slice(mid).join('</p>') + (paragraphs.slice(mid).length ? '</p>' : '');
            leftContent = paragraphs.slice(0, mid).join('</p>') + (mid ? '</p>' : '');
            rightTitle = 'Continuación';
        }

        return `
            <div class="rendered-slide slide-two-column" data-slide-index="${index}" data-slide-type="two-column">
                <header class="slide-header">
                    <div>
                        <h2 class="slide-title">${title}</h2>
                    </div>
                    <div class="slide-actions">
                        <button class="slide-action-btn edit-slide" aria-label="Editar diapositiva" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="slide-action-btn delete-slide" aria-label="Eliminar diapositiva" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </header>
                <div class="slide-body">
                    <div class="two-column-layout">
                        <div class="col">
                            <h4>${leftTitle}</h4>
                            ${leftContent || '<p>Contenido de la columna izquierda</p>'}
                        </div>
                        <div class="col">
                            <h4>${rightTitle}</h4>
                            ${rightContent || '<p>Contenido de la columna derecha</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderConclusionSlide(blocks, index, total) {
        let title = 'Conclusión';
        let content = 'Gracias por su atención.';

        for (const block of blocks) {
            if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
                title = escapeHtml(block.content);
            } else if (block.type === 'paragraph') {
                content = escapeHtml(block.lines.join(' '));
            } else if (block.type === 'list') {
                content = block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
                content = `<ul>${content}</ul>`;
            }
        }

        return `
            <div class="rendered-slide slide-conclusion" data-slide-index="${index}" data-slide-type="conclusion">
                <header class="slide-header">
                    <div>
                        <h2 class="slide-title">${title}</h2>
                    </div>
                    <div class="slide-actions">
                        <button class="slide-action-btn edit-slide" aria-label="Editar diapositiva" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="slide-action-btn delete-slide" aria-label="Eliminar diapositiva" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </header>
                <div class="slide-body">
                    <div class="conclusion-content">
                        <p>${content}</p>
                        <div class="conclusion-highlight">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                            Fin de la presentación
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSectionSlide(blocks, index, total) {
        let title = 'Nueva sección';

        for (const block of blocks) {
            if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
                title = escapeHtml(block.content);
                break;
            } else if (block.type === 'paragraph') {
                title = escapeHtml(block.lines[0].substring(0, 60));
                break;
            }
        }

        return `
            <div class="rendered-slide slide-section" data-slide-index="${index}" data-slide-type="section">
                <header class="slide-header">
                    <div>
                        <h2 class="slide-title">${title}</h2>
                    </div>
                    <div class="slide-actions">
                        <button class="slide-action-btn edit-slide" aria-label="Editar diapositiva" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="slide-action-btn delete-slide" aria-label="Eliminar diapositiva" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </header>
            </div>
        `;
    }

    /**
     * Función principal: genera presentación completa
     */
    function generate(text) {
        if (!text || !text.trim()) {
            throw new Error('El contenido no puede estar vacío');
        }

        const blocks = parseBlocks(text);
        const topic = detectTopic(blocks);
        const subtitle = detectSubtitle(blocks, topic);
        const slideGroups = groupIntoSlides(blocks);

        const slides = slideGroups.map((group, i) => ({
            id: `slide-${Date.now()}-${i}`,
            index: i,
            type: group.type,
            html: renderSlide(group, i, slideGroups.length),
            blocks: group.blocks,
            title: extractSlideTitle(group.blocks, group.type)
        }));

        return {
            title: topic,
            subtitle: subtitle,
            slides: slides,
            totalSlides: slides.length,
            generatedAt: new Date().toISOString()
        };
    }

    function extractSlideTitle(blocks, type) {
        for (const block of blocks) {
            if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
                return block.content;
            }
        }
        const typeNames = {
            cover: 'Portada',
            content: 'Contenido',
            'bullet-list': 'Lista de puntos',
            'two-column': 'Dos columnas',
            conclusion: 'Conclusión',
            section: 'Sección'
        };
        return typeNames[type] || 'Diapositiva';
    }

    // API pública
    return {
        generate,
        SLIDE_TYPES,
        parseBlocks,
        escapeHtml,
        normalizeText
    };
})();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlideGenerator;
}

// Exponer globalmente para uso en navegador (scripts no-módulo)
if (typeof window !== 'undefined') {
    window.SlideGenerator = SlideGenerator;
}