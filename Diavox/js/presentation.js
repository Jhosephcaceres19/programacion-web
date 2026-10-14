/**
 * Diavox - Módulo de presentación
 * Maneja el modo presentación a pantalla completa, navegación y exportación
 */

const PresentationMode = (function() {
    'use strict';

    let currentSlides = [];
    let currentIndex = 0;
    let isPresentationMode = false;
    let slideContainer = null;
    let presentationOverlay = null;
    let presentationSlide = null;
    let keyboardHandler = null;

    // Elementos del DOM
    const elements = {
        prevBtn: null,
        nextBtn: null,
        currentEl: null,
        totalEl: null,
        presPrev: null,
        presNext: null,
        presCurrent: null,
        presTotal: null,
        presExit: null,
        editModal: null,
        editForm: null,
        editSlideTitle: null,
        editSlideContent: null,
        editSlideType: null,
        closeEditModal: null,
        cancelEdit: null,
        thumbnailsList: null,
        slideContainer: null
    };

    let editingSlideIndex = -1;
    let currentPresentationData = null;

    /**
     * Inicializa el módulo
     */
    function init(domElements) {
        Object.assign(elements, domElements);
        slideContainer = elements.slideContainer;
        presentationOverlay = document.getElementById('presentation-mode');
        presentationSlide = document.getElementById('presentation-slide');

        bindEvents();
        setupKeyboardNavigation();
    }

    /**
     * Vincula eventos de la UI
     */
    function bindEvents() {
        // Navegación normal
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', goToPrevious);
        }
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', goToNext);
        }

        // Modo presentación
        if (elements.presPrev) {
            elements.presPrev.addEventListener('click', presGoToPrevious);
        }
        if (elements.presNext) {
            elements.presNext.addEventListener('click', presGoToNext);
        }
        if (elements.presExit) {
            elements.presExit.addEventListener('click', exitPresentationMode);
        }

        // Miniaturas (delegación)
        if (elements.thumbnailsList) {
            elements.thumbnailsList.addEventListener('click', handleThumbnailClick);
        }

        // Contenedor de diapositivas (delegación para editar/eliminar)
        if (elements.slideContainer) {
            elements.slideContainer.addEventListener('click', handleSlideAction);
        }

        // Modal de edición
        if (elements.editForm) {
            elements.editForm.addEventListener('submit', handleEditSubmit);
        }
        if (elements.closeEditModal) {
            elements.closeEditModal.addEventListener('click', closeEditModal);
        }
        if (elements.cancelEdit) {
            elements.cancelEdit.addEventListener('click', closeEditModal);
        }
        if (elements.editModal) {
            elements.editModal.addEventListener('click', (e) => {
                if (e.target === elements.editModal || e.target.classList.contains('modal-backdrop')) {
                    closeEditModal();
                }
            });
        }
    }

    /**
     * Configura navegación por teclado
     */
    function setupKeyboardNavigation() {
        keyboardHandler = (e) => {
            if (!isPresentationMode) return;

            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    presGoToNext();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    presGoToPrevious();
                    break;
                case 'Escape':
                    e.preventDefault();
                    exitPresentationMode();
                    break;
                case 'f':
                case 'F':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        toggleFullscreen();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(currentSlides.length - 1);
                    break;
            }
        };

        document.addEventListener('keydown', keyboardHandler);
    }

    /**
     * Establece las diapositivas actuales
     */
    function setSlides(slides, presentationData = null) {
        currentSlides = slides || [];
        currentPresentationData = presentationData;
        currentIndex = 0;
        updateNavigation();
        renderThumbnails();
        goToSlide(0);
    }

    /**
     * Obtiene las diapositivas actuales
     */
    function getSlides() {
        return currentSlides;
    }

    /**
     * Navega a una diapositiva específica (vista normal)
     */
    function goToSlide(index) {
        if (index < 0 || index >= currentSlides.length) return;

        currentIndex = index;
        updateNavigation();
        updateThumbnails();
        renderCurrentSlide();
    }

    /**
     * Diapositiva anterior (vista normal)
     */
    function goToPrevious() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    /**
     * Diapositiva siguiente (vista normal)
     */
    function goToNext() {
        if (currentIndex < currentSlides.length - 1) {
            goToSlide(currentIndex + 1);
        }
    }

    /**
     * Actualiza botones de navegación normal
     */
    function updateNavigation() {
        if (elements.prevBtn) {
            elements.prevBtn.disabled = currentIndex === 0;
        }
        if (elements.nextBtn) {
            elements.nextBtn.disabled = currentIndex >= currentSlides.length - 1;
        }
        if (elements.currentEl) {
            elements.currentEl.textContent = currentIndex + 1;
        }
        if (elements.totalEl) {
            elements.totalEl.textContent = currentSlides.length;
        }
    }

    /**
     * Renderiza la diapositiva actual en vista normal
     */
    function renderCurrentSlide() {
        if (!slideContainer || currentSlides.length === 0) return;

        const slide = currentSlides[currentIndex];
        if (!slide) return;

        // Mostrar contenedor y ocultar estado vacío
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.hidden = true;
            emptyState.removeAttribute('hidden');
        }
        slideContainer.hidden = false;
        slideContainer.removeAttribute('hidden');
        slideContainer.style.display = '';

        slideContainer.innerHTML = slide.html;

        // Agregar event listeners a los botones de la diapositiva renderizada
        const editBtn = slideContainer.querySelector('.edit-slide');
        const deleteBtn = slideContainer.querySelector('.delete-slide');

        if (editBtn) {
            editBtn.addEventListener('click', () => openEditModal(currentIndex));
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteSlide(currentIndex));
        }
    }

    /**
     * Renderiza miniaturas
     */
    function renderThumbnails() {
        if (!elements.thumbnailsList) return;

        elements.thumbnailsList.innerHTML = currentSlides.map((slide, i) => `
            <button class="thumbnail ${i === currentIndex ? 'active' : ''}"
                    data-index="${i}"
                    role="option"
                    aria-selected="${i === currentIndex}"
                    aria-label="Diapositiva ${i + 1}: ${slide.title}"
                    title="${slide.title}">
            </button>
        `).join('');

        // Generar previews visuales para las miniaturas (async)
        requestAnimationFrame(() => generateThumbnailPreviews());
    }

    /**
     * Genera previews visuales para miniaturas usando canvas o HTML
     */
    function generateThumbnailPreviews() {
        const thumbnails = elements.thumbnailsList.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            const slide = currentSlides[i];
            if (!slide) return;

            // Crear una versión simplificada para la miniatura
            const preview = createSlidePreview(slide, i);
            thumb.innerHTML = preview;
            thumb.setAttribute('data-index', i);
        });
    }

    /**
     * Crea preview HTML simplificado para miniatura
     */
    function createSlidePreview(slide, index) {
        const type = slide.type;
        const title = slide.title || `Diapositiva ${index + 1}`;

        switch (type) {
            case 'cover':
                return `<div class="thumb-preview thumb-cover"><span class="thumb-title">${escapeHtml(title)}</span></div>`;
            case 'bullet-list':
                return `<div class="thumb-preview thumb-bullets"><span class="thumb-title">${escapeHtml(title)}</span><div class="thumb-bullet"></div><div class="thumb-bullet"></div><div class="thumb-bullet"></div></div>`;
            case 'two-column':
                return `<div class="thumb-preview thumb-two-col"><span class="thumb-title">${escapeHtml(title)}</span><div class="thumb-cols"><div></div><div></div></div></div>`;
            case 'conclusion':
                return `<div class="thumb-preview thumb-conclusion"><span class="thumb-title">${escapeHtml(title)}</span><div class="thumb-check"></div></div>`;
            case 'section':
                return `<div class="thumb-preview thumb-section"><span class="thumb-title">${escapeHtml(title)}</span></div>`;
            default:
                return `<div class="thumb-preview thumb-content"><span class="thumb-title">${escapeHtml(title)}</span><div class="thumb-lines"></div><div class="thumb-lines"></div><div class="thumb-lines short"></div></div>`;
        }
    }

    /**
     * Actualiza miniaturas activas
     */
    function updateThumbnails() {
        if (!elements.thumbnailsList) return;
        const thumbs = elements.thumbnailsList.querySelectorAll('.thumbnail');
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
            thumb.setAttribute('aria-selected', i === currentIndex);
        });

        // Scroll a la miniatura activa
        const activeThumb = thumbs[currentIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    /**
     * Maneja clic en miniatura
     */
    function handleThumbnailClick(e) {
        const thumb = e.target.closest('.thumbnail');
        if (thumb) {
            const index = parseInt(thumb.dataset.index, 10);
            if (!isNaN(index)) {
                goToSlide(index);
            }
        }
    }

    /**
     * Maneja acciones en diapositiva (editar/eliminar)
     */
    function handleSlideAction(e) {
        const editBtn = e.target.closest('.edit-slide');
        const deleteBtn = e.target.closest('.delete-slide');

        if (editBtn) {
            e.stopPropagation();
            // El índice se pasa via data attribute o closure
            const slideEl = editBtn.closest('.rendered-slide');
            if (slideEl) {
                const index = parseInt(slideEl.dataset.slideIndex, 10);
                if (!isNaN(index)) openEditModal(index);
            }
        } else if (deleteBtn) {
            e.stopPropagation();
            const slideEl = deleteBtn.closest('.rendered-slide');
            if (slideEl) {
                const index = parseInt(slideEl.dataset.slideIndex, 10);
                if (!isNaN(index)) deleteSlide(index);
            }
        }
    }

    /**
     * Abre modal de edición
     */
    function openEditModal(index) {
        if (index < 0 || index >= currentSlides.length) return;

        editingSlideIndex = index;
        const slide = currentSlides[index];

        if (elements.editSlideTitle) elements.editSlideTitle.value = slide.title || '';
        if (elements.editSlideContent) elements.editSlideContent.value = extractTextContent(slide.html);
        if (elements.editSlideType) elements.editSlideType.value = slide.type || 'content';

        if (elements.editModal) {
            elements.editModal.showModal();
            elements.editSlideTitle.focus();
        }
    }

    /**
     * Cierra modal de edición
     */
    function closeEditModal() {
        if (elements.editModal) {
            elements.editModal.close();
        }
        editingSlideIndex = -1;
    }

    /**
     * Maneja envío del formulario de edición
     */
    function handleEditSubmit(e) {
        e.preventDefault();
        if (editingSlideIndex < 0) return;

        const newTitle = elements.editSlideTitle.value.trim();
        const newContent = elements.editSlideContent.value.trim();
        const newType = elements.editSlideType.value;

        if (!newTitle && !newContent) {
            showToast('El título o contenido no pueden estar vacíos', 'error');
            return;
        }

        // Actualizar diapositiva
        const updatedSlide = updateSlide(editingSlideIndex, newTitle, newContent, newType);
        if (updatedSlide) {
            currentSlides[editingSlideIndex] = updatedSlide;
            renderCurrentSlide();
            renderThumbnails();
            showToast('Diapositiva actualizada', 'success');
        }

        closeEditModal();
    }

    /**
     * Actualiza una diapositiva con nuevos datos
     */
    function updateSlide(index, title, content, type) {
        const slide = currentSlides[index];
        if (!slide) return null;

        // Re-generar HTML con nuevos datos
        const blocks = parseEditContent(content, type);
        const html = renderEditedSlide(blocks, index, type, title);

        return {
            ...slide,
            title: title || slide.title,
            type: type,
            html: html,
            blocks: blocks
        };
    }

    /**
     * Parsea contenido del editor a bloques
     */
    function parseEditContent(text, type) {
        const lines = text.split('\n').filter(l => l.trim());
        const blocks = [];

        if (type === 'cover') {
            const title = lines[0] || 'Título';
            const subtitle = lines[1] || 'Subtítulo';
            blocks.push({ type: 'h1', content: title });
            blocks.push({ type: 'paragraph', lines: [subtitle] });
        } else if (type === 'bullet-list') {
            const title = lines[0] || 'Lista';
            blocks.push({ type: 'h2', content: title });
            const items = lines.slice(1).map(l => l.replace(/^[\-\*]\s*/, ''));
            blocks.push({ type: 'list', items: items, lines: lines.slice(1) });
        } else if (type === 'two-column') {
            const title = lines[0] || 'Dos columnas';
            blocks.push({ type: 'h2', content: title });
            const mid = Math.ceil(lines.length / 2);
            blocks.push({ type: 'paragraph', lines: lines.slice(1, mid) });
            blocks.push({ type: 'hr' });
            blocks.push({ type: 'paragraph', lines: lines.slice(mid) });
        } else if (type === 'conclusion') {
            const title = lines[0] || 'Conclusión';
            blocks.push({ type: 'h2', content: title });
            blocks.push({ type: 'paragraph', lines: lines.slice(1) });
        } else if (type === 'section') {
            const title = lines[0] || 'Sección';
            blocks.push({ type: 'h2', content: title });
        } else {
            // content
            const title = lines[0] || 'Contenido';
            blocks.push({ type: 'h2', content: title });
            blocks.push({ type: 'paragraph', lines: lines.slice(1) });
        }

        return blocks;
    }

    /**
     * Renderiza diapositiva editada
     */
    function renderEditedSlide(blocks, index, type, title) {
        // Usar el generador para renderizar
        const slideData = { type, blocks };
        return SlideGenerator.renderSlide ? SlideGenerator.renderSlide(slideData, index, currentSlides.length) : generateSlideHtml(blocks, index, type, title);
    }

    /**
     * Genera HTML para diapositiva (fallback si no hay SlideGenerator)
     */
    function generateSlideHtml(blocks, index, type, title) {
        // Implementación simplificada inline
        let html = `<div class="rendered-slide slide-${type}" data-slide-index="${index}" data-slide-type="${type}">`;
        html += `<header class="slide-header"><div>`;
        if (title) html += `<h2 class="slide-title">${SlideGenerator.escapeHtml(title)}</h2>`;
        html += `</div><div class="slide-actions">`;
        html += `<button class="slide-action-btn edit-slide" aria-label="Editar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>`;
        html += `<button class="slide-action-btn delete-slide" aria-label="Eliminar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`;
        html += `</div></header>`;

        if (type !== 'section') {
            html += `<div class="slide-body">`;
            for (const block of blocks) {
                if (block.type === 'paragraph') {
                    html += `<div class="slide-content-text">`;
                    for (const line of block.lines) {
                        html += `<p>${SlideGenerator.escapeHtml(line)}</p>`;
                    }
                    html += `</div>`;
                } else if (block.type === 'list') {
                    html += `<div class="bullet-list">`;
                    block.items.forEach((item, i) => {
                        html += `<div class="bullet-item"><span class="bullet-marker">${i + 1}</span><span class="bullet-text">${SlideGenerator.escapeHtml(item)}</span></div>`;
                    });
                    html += `</div>`;
                }
            }
            html += `</div>`;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Extrae texto plano del HTML de una diapositiva
     */
    function extractTextContent(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        // Obtener título
        const titleEl = div.querySelector('.slide-title');
        const title = titleEl ? titleEl.textContent : '';
        // Obtener contenido del body
        const bodyEl = div.querySelector('.slide-body');
        const content = bodyEl ? bodyEl.textContent.trim() : '';
        return title + '\n' + content;
    }

    /**
     * Elimina una diapositiva
     */
    function deleteSlide(index) {
        if (currentSlides.length <= 1) {
            showToast('No se puede eliminar la única diapositiva', 'warning');
            return;
        }

        if (confirm('¿Eliminar esta diapositiva?')) {
            currentSlides.splice(index, 1);
            // Re-indexar
            currentSlides.forEach((s, i) => s.index = i);
            currentIndex = Math.min(currentIndex, currentSlides.length - 1);
            updateNavigation();
            renderThumbnails();
            goToSlide(currentIndex);
            showToast('Diapositiva eliminada', 'success');
        }
    }

    // ============ MODO PRESENTACIÓN ============

    /**
     * Inicia modo presentación
     */
    function enterPresentationMode(startIndex = 0) {
        if (currentSlides.length === 0) {
            showToast('No hay diapositivas para presentar', 'warning');
            return;
        }

        isPresentationMode = true;
        currentIndex = Math.max(0, Math.min(startIndex, currentSlides.length - 1));

        if (presentationOverlay) {
            presentationOverlay.hidden = false;
            document.body.style.overflow = 'hidden';
        }

        renderPresentationSlide();
        updatePresentationControls();

        // Auto-hide controles después de 3s
        scheduleControlsHide();
    }

    /**
     * Sale del modo presentación
     */
    function exitPresentationMode() {
        isPresentationMode = false;
        if (presentationOverlay) {
            presentationOverlay.hidden = true;
            document.body.style.overflow = '';
        }
    }

    /**
     * Renderiza diapositiva en modo presentación
     */
    function renderPresentationSlide() {
        if (!presentationSlide || !currentSlides[currentIndex]) return;

        const slide = currentSlides[currentIndex];
        presentationSlide.innerHTML = slide.html;

        // Remover botones de edición en modo presentación
        const editBtns = presentationSlide.querySelectorAll('.slide-actions');
        editBtns.forEach(btn => btn.remove());

        // Ajustar estilos para presentación
        const renderedSlide = presentationSlide.querySelector('.rendered-slide');
        if (renderedSlide) {
            renderedSlide.style.borderRadius = '0';
            renderedSlide.style.boxShadow = 'none';
        }
    }

    /**
     * Actualiza controles de presentación
     */
    function updatePresentationControls() {
        if (elements.presPrev) elements.presPrev.disabled = currentIndex === 0;
        if (elements.presNext) elements.presNext.disabled = currentIndex >= currentSlides.length - 1;
        if (elements.presCurrent) elements.presCurrent.textContent = currentIndex + 1;
        if (elements.presTotal) elements.presTotal.textContent = currentSlides.length;
    }

    /**
     * Diapositiva anterior en presentación
     */
    function presGoToPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            renderPresentationSlide();
            updatePresentationControls();
            scheduleControlsHide();
        }
    }

    /**
     * Diapositiva siguiente en presentación
     */
    function presGoToNext() {
        if (currentIndex < currentSlides.length - 1) {
            currentIndex++;
            renderPresentationSlide();
            updatePresentationControls();
            scheduleControlsHide();
        }
    }

    let controlsHideTimer = null;
    function scheduleControlsHide() {
        clearTimeout(controlsHideTimer);
        const controls = document.querySelector('.presentation-controls');
        if (controls) controls.classList.remove('hidden');
        controlsHideTimer = setTimeout(() => {
            if (controls) controls.classList.add('hidden');
        }, 3000);
    }

    /**
     * Alterna pantalla completa
     */
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            presentationOverlay.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    }

    // ============ EXPORTACIÓN ============

    /**
     * Exporta como PDF (usa print del navegador)
     */
    function exportToPDF() {
        if (currentSlides.length === 0) {
            showToast('No hay presentación para exportar', 'warning');
            return;
        }

        // Crear ventana de impresión
        const printWindow = window.open('', '_blank', 'width=1024,height=768');
        if (!printWindow) {
            showToast('Permita ventanas emergentes para exportar', 'error');
            return;
        }

        const printContent = generatePrintHTML();
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Esperar a que cargue y luego imprimir
        printWindow.onload = () => {
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                // Opcional: cerrar después de imprimir
                // setTimeout(() => printWindow.close(), 1000);
            }, 250);
        };

        showToast('Preparando exportación...', 'info');
    }

    /**
     * Genera HTML optimizado para impresión
     */
    function generatePrintHTML() {
        const data = currentPresentationData || { title: 'Presentación', subtitle: '' };
        const slidesHtml = currentSlides.map(slide => slide.html).join('\n');

        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${SlideGenerator.escapeHtml(data.title)} - Diavox</title>
    <style>
        @page { size: A4 landscape; margin: 1cm; }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background: white; color: black; }
        .rendered-slide { page-break-after: always; break-after: page; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: white; height: 100vh; min-height: 100vh; display: flex; flex-direction: column; }
        .rendered-slide:last-child { page-break-after: auto; }
        .slide-header { padding: 2rem; border-bottom: 1px solid #eee; flex-shrink: 0; }
        .slide-cover .slide-header { padding: 4rem 2rem; text-align: center; background: #f5f5f5; border-bottom: none; }
        .slide-title { font-size: 2.5rem; font-weight: 800; color: #111; margin: 0; line-height: 1.2; }
        .slide-cover .slide-title { font-size: 3.5rem; background: linear-gradient(135deg, #4f46e5, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .slide-subtitle { font-size: 1.5rem; color: #666; font-weight: 400; margin-top: 0.5rem; }
        .slide-body { padding: 2rem; flex: 1; overflow: hidden; }
        .slide-content-text { font-size: 1.1rem; line-height: 1.7; color: #333; }
        .slide-content-text p { margin-bottom: 1rem; }
        .bullet-list { display: flex; flex-direction: column; gap: 1rem; }
        .bullet-item { display: flex; gap: 1rem; padding: 1rem; background: #fafafa; border: 1px solid #eee; border-radius: 8px; }
        .bullet-marker { flex-shrink: 0; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #4f46e5, #0ea5e9); color: white; border-radius: 6px; font-weight: 700; }
        .two-column-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .two-column-layout .col { padding: 1.5rem; background: #fafafa; border: 1px solid #eee; border-radius: 8px; }
        .two-column-layout .col h4 { font-size: 1.1rem; font-weight: 600; color: #4f46e5; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #4f46e5; }
        .slide-conclusion .slide-header { background: #ecfdf5; border-bottom: 3px solid #10b981; }
        .slide-conclusion .slide-title { color: #10b981; }
        .conclusion-content { text-align: center; max-width: 600px; margin: 0 auto; }
        .conclusion-content p { font-size: 1.3rem; line-height: 1.6; color: #333; margin-bottom: 2rem; }
        .conclusion-highlight { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: linear-gradient(135deg, #10b981, #4f46e5); color: white; border-radius: 9999px; font-weight: 600; }
        .slide-section .slide-header { padding: 3rem 2rem; text-align: center; background: #fafafa; border: 2px dashed #ddd; border-radius: 0; }
        .slide-section .slide-title { font-size: 2.5rem; color: #666; }
        .slide-section .slide-title::after { content: ''; display: block; width: 60px; height: 3px; background: linear-gradient(90deg, #4f46e5, #0ea5e9); margin: 1rem auto 0; border-radius: 9999px; }
        .slide-actions { display: none !important; }
        @media print {
            .slide-header, .slide-body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    ${slidesHtml}
</body>
</html>
        `;
    }

    // ============ UTILIDADES ============

    function escapeHtml(text) {
        return SlideGenerator.escapeHtml ? SlideGenerator.escapeHtml(text) :
            text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function showToast(message, type = 'info') {
        // Se implementa en app.js
        if (window.DiavoxApp && window.DiavoxApp.showToast) {
            window.DiavoxApp.showToast(message, type);
        }
    }

    // API pública
    return {
        init,
        setSlides,
        getSlides,
        goToSlide,
        goToPrevious,
        goToNext,
        enterPresentationMode,
        exitPresentationMode,
        exportToPDF,
        openEditModal,
        updateSlide: updateSlide
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationMode;
}

// Exponer globalmente para uso en navegador (scripts no-módulo)
if (typeof window !== 'undefined') {
    window.PresentationMode = PresentationMode;
}