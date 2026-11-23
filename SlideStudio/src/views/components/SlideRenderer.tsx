
import type { Slide } from '../../models/Slide';

import LayoutTextOnly from './LayoutTextOnly';
import LayoutImageOnly from './LayoutImageOnly';
import LayoutTextAndImage from './LayoutTextAndImage';

interface SlideRendererProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  editable?: boolean;
  onSlideChange?: (changes: Partial<Slide>) => void;
}

export default function SlideRenderer({
  slide,
  slideNumber,
  totalSlides,
  editable = false,
  onSlideChange,
}: SlideRendererProps) {

  // Portada
  if (slide.type === 'title') {
    return (
      <article className="flex flex-col items-center justify-center text-center w-full h-full min-h-[480px] bg-gradient-to-br from-blue-950 to-blue-700 text-white p-8 md:p-12">

        {editable ? (
          <input
            type="text"
            value={slide.topic ?? ''}
            onChange={(event) =>
              onSlideChange?.({ topic: event.target.value })
            }
            placeholder="Tema de la presentación"
            className="w-full max-w-2xl bg-transparent text-center uppercase tracking-[0.3em] text-blue-200 text-sm mb-8 outline-none border-b border-transparent focus:border-blue-300 placeholder:text-blue-300/60"
          />
        ) : (
          <p className="uppercase tracking-[0.3em] text-blue-200 text-sm mb-8">
            {slide.topic || 'Presentación'}
          </p>
        )}

        {editable ? (
          <textarea
            value={slide.title}
            onChange={(event) =>
              onSlideChange?.({ title: event.target.value })
            }
            rows={2}
            placeholder="Título de la presentación"
            className="w-full bg-transparent text-center text-4xl md:text-6xl font-bold mb-8 outline-none resize-none border-b border-transparent focus:border-blue-300 placeholder:text-white/60"
          />
        ) : (
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            {slide.title}
          </h1>
        )}

        {editable ? (
          <textarea
            value={slide.content}
            onChange={(event) =>
              onSlideChange?.({ content: event.target.value })
            }
            rows={3}
            placeholder="Subtítulo o descripción"
            className="w-full max-w-2xl bg-transparent text-center text-xl text-blue-100 outline-none resize-none border-b border-transparent focus:border-blue-300 placeholder:text-blue-200/60"
          />
        ) : (
          <p className="text-xl text-blue-100 max-w-2xl whitespace-pre-wrap">
            {slide.content}
          </p>
        )}

        <div className="mt-10 text-blue-200">
          <p>{slide.author || 'Autor'}</p>
          <p className="text-sm mt-2">
            {slide.date || new Date().toLocaleDateString()}
          </p>
        </div>
      </article>
    );
  }

  // Diapositivas de desarrollo
  const commonProps = {
    slide,
    slideNumber,
    totalSlides,
    editable,
    onSlideChange,
  };

  switch (slide.layout) {
    case 'text-only':
      return <LayoutTextOnly {...commonProps} />;

    case 'image-only':
      return <LayoutImageOnly {...commonProps} />;

    case 'text-and-image':
      return <LayoutTextAndImage {...commonProps} />;

    default:
      return <LayoutTextOnly {...commonProps} />;
  }
}
