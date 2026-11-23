import { useEffect, useRef, useState } from 'react';

import type { Project } from '../../models/Project';

import SlideRenderer from '../components/SlideRenderer';

interface PresentationViewProps {
  project: Project;
  onExit: () => void;
}

export default function PresentationView({
  project,
  onExit,
}: PresentationViewProps) {

  const slides = [...project.slide].sort(
    (a, b) => a.order - b.order,
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const presentationRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentIndex];

  function nextSlide() {
    setCurrentIndex((index) =>
      Math.min(index + 1, slides.length - 1),
    );
  }

  function previousSlide() {
    setCurrentIndex((index) =>
      Math.max(index - 1, 0),
    );
  }

  async function enterFullscreen() {
    if (presentationRef.current?.requestFullscreen) {
      await presentationRef.current.requestFullscreen();
    }
  }

  async function exitPresentation() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

    onExit();
  }

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)
      ) {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        nextSlide();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previousSlide();
      }

      if (event.key === 'Escape') {
        if (!document.fullscreenElement) {
          onExit();
        }
      }
    }

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [slides.length, onExit]);

  useEffect(() => {
    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        onExit();
      }
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange,
      );
    };
  }, [onExit]);

  if (slides.length === 0 || !currentSlide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No hay diapositivas para presentar.</p>
      </div>
    );
  }

  return (
    <div
      ref={presentationRef}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
    >

      {/* Barra superior */}
      <header className="flex items-center justify-between px-6 py-3 text-white">

        <div>
          <h1 className="font-semibold">
            {project.name}
          </h1>

          <p className="text-xs text-slate-400">
            Diapositiva {currentIndex + 1} de {slides.length}
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={enterFullscreen}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
          >
            Pantalla completa
          </button>

          <button
            onClick={exitPresentation}
            className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
          >
            Salir
          </button>

        </div>

      </header>

      {/* Diapositiva */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">

        <div className="w-full max-w-6xl aspect-video bg-white shadow-2xl overflow-hidden">

          <SlideRenderer
            slide={currentSlide}
            slideNumber={currentIndex + 1}
            totalSlides={slides.length}
          />

        </div>

      </main>

      {/* Navegación */}
      <footer className="flex items-center justify-center gap-6 py-4">

        <button
          onClick={previousSlide}
          disabled={currentIndex === 0}
          className="px-5 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30"
        >
          ← Anterior
        </button>

        <span className="text-white text-sm">
          {currentIndex + 1} / {slides.length}
        </span>

        <button
          onClick={nextSlide}
          disabled={currentIndex === slides.length - 1}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30"
        >
          Siguiente →
        </button>

      </footer>

    </div>
  );
}