import { useState } from 'react';

import type { Project } from '../../models/Project';
import type { Slide, SlideLayout } from '../../models/Slide';

import SlideRenderer from '../components/SlideRenderer';

interface EditorViewProps {
  project: Project;
  onProjectChange: (project: Project) => void;
  onStartPresentation: () => void;
  onBack: () => void;
}

export default function EditorView({
  project,
  onProjectChange,
  onStartPresentation,
  onBack,
}: EditorViewProps) {

  const [selectedSlideId, setSelectedSlideId] = useState(
    project.slide[0]?.id ?? '',
  );

  const slides = [...project.slide].sort(
    (a, b) => a.order - b.order,
  );

  const selectedSlide = slides.find(
    (slide) => slide.id === selectedSlideId,
  );

  function updateSlide(
    id: string,
    changes: Partial<Slide>,
  ) {
    const updatedSlides = project.slide.map((slide) =>
      slide.id === id
        ? {
            ...slide,
            ...changes,
            updatedAt: new Date().toISOString(),
          }
        : slide,
    );

    onProjectChange({
      ...project,
      slide: updatedSlides,
      updatedAt: new Date().toISOString(),
    });
  }

  function addSlide() {
    const now = new Date().toISOString();

    const newSlide: Slide = {
      id: crypto.randomUUID(),
      projectId: project.id,
      title: 'Nueva diapositiva',
      content: 'Escribe aquí tu contenido',
      type: 'content',
      layout: 'text-only',
      author: '',
      topic: '',
      date: now,
      order: project.slide.length,
      createdAt: now,
      updatedAt: now,
    };

    onProjectChange({
      ...project,
      slide: [...project.slide, newSlide],
      updatedAt: now,
    });

    setSelectedSlideId(newSlide.id);
  }

  function deleteSlide(id: string) {
    const slideToDelete = project.slide.find(
      (slide) => slide.id === id,
    );

    if (!slideToDelete) return;

    if (slideToDelete.type === 'title') {
      alert('No puedes eliminar la portada.');
      return;
    }

    const updatedSlides = project.slide
      .filter((slide) => slide.id !== id)
      .map((slide, index) => ({
        ...slide,
        order: index,
      }));

    onProjectChange({
      ...project,
      slide: updatedSlides,
      updatedAt: new Date().toISOString(),
    });

    setSelectedSlideId(
      updatedSlides[0]?.id ?? '',
    );
  }

  function updateProjectMetadata(
    field: 'author' | 'topic',
    value: string,
  ) {
    if (!selectedSlide) return;

    updateSlide(selectedSlide.id, {
      [field]: value,
    });
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Barra superior */}
      <header className="bg-slate-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">

        <div>
          <button
            onClick={onBack}
            className="text-sm text-slate-300 hover:text-white mb-1"
          >
            ← Volver a proyectos
          </button>

          <h1 className="text-xl font-bold">
            {project.name}
          </h1>
        </div>

        <div className="flex gap-3">

          <button
            onClick={addSlide}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
          >
            + Nueva diapositiva
          </button>

          <button
            onClick={onStartPresentation}
            disabled={slides.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
          >
            Presentar
          </button>

        </div>

      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] min-h-[calc(100vh-80px)]">

        {/* Panel de diapositivas */}
        <aside className="bg-white border-r border-slate-200 p-4">

          <h2 className="font-bold text-slate-700 mb-4">
            Diapositivas ({slides.length})
          </h2>

          <div className="space-y-3">

            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setSelectedSlideId(slide.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedSlideId === slide.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <span className="text-xs text-slate-400">
                  Diapositiva {index + 1}
                </span>

                <p className="font-semibold text-sm text-slate-800 truncate">
                  {slide.title}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {slide.type === 'title'
                    ? 'Portada'
                    : slide.layout}
                </p>
              </button>
            ))}

          </div>

        </aside>

        {/* Área de previsualización */}
        <section className="p-4 md:p-8 flex flex-col items-center justify-center min-w-0">

          {selectedSlide ? (
            <>
              <div className="w-full max-w-5xl aspect-video shadow-xl overflow-hidden rounded-lg">
                <SlideRenderer
                  slide={selectedSlide}
                  slideNumber={
                    slides.findIndex(
                      (slide) => slide.id === selectedSlide.id,
                    ) + 1
                  }
                  totalSlides={slides.length}
                />
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Vista previa de la diapositiva seleccionada
              </p>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-700">
                No hay diapositivas
              </h2>

              <button
                onClick={addSlide}
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Crear diapositiva
              </button>
            </div>
          )}

        </section>

        {/* Panel de edición */}
        <aside className="bg-white border-l border-slate-200 p-5">

          <h2 className="font-bold text-lg text-slate-800 mb-5">
            Propiedades
          </h2>

          {selectedSlide ? (
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Título
                </label>

                <input
                  type="text"
                  value={selectedSlide.title}
                  onChange={(event) =>
                    updateSlide(selectedSlide.id, {
                      title: event.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contenido
                </label>

                <textarea
                  value={selectedSlide.content}
                  onChange={(event) =>
                    updateSlide(selectedSlide.id, {
                      content: event.target.value,
                    })
                  }
                  rows={6}
                  className="w-full border rounded-lg px-3 py-2 resize-y"
                />
              </div>

              {selectedSlide.type === 'content' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Diseño de diapositiva
                  </label>

                  <select
                    value={selectedSlide.layout}
                    onChange={(event) =>
                      updateSlide(selectedSlide.id, {
                        layout: event.target.value as SlideLayout,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="text-only">
                      Solo texto
                    </option>

                    <option value="image-only">
                      Solo imagen
                    </option>

                    <option value="text-and-image">
                      Texto e imagen
                    </option>
                  </select>
                </div>
              )}

              {selectedSlide.layout !== 'text-only' &&
                selectedSlide.type === 'content' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      URL de imagen
                    </label>

                    <input
                      type="url"
                      value={selectedSlide.imageUrl ?? ''}
                      onChange={(event) =>
                        updateSlide(selectedSlide.id, {
                          imageUrl: event.target.value,
                        })
                      }
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Autor
                </label>

                <input
                  type="text"
                  value={selectedSlide.author ?? ''}
                  onChange={(event) =>
                    updateProjectMetadata(
                      'author',
                      event.target.value,
                    )
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tema
                </label>

                <input
                  type="text"
                  value={selectedSlide.topic ?? ''}
                  onChange={(event) =>
                    updateProjectMetadata(
                      'topic',
                      event.target.value,
                    )
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {selectedSlide.type !== 'title' && (
                <button
                  onClick={() => deleteSlide(selectedSlide.id)}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg py-2"
                >
                  Eliminar diapositiva
                </button>
              )}

            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              Selecciona una diapositiva para editarla.
            </p>
          )}

        </aside>

      </main>

    </div>
  );
}