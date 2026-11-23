
import type { Slide } from '../../models/Slide';
import HeaderFooter from './HeaderFooter';

interface LayoutTextOnlyProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  editable?: boolean;
  onSlideChange?: (changes: Partial<Slide>) => void;
}

export default function LayoutTextOnly({
  slide,
  slideNumber,
  totalSlides,
  editable = false,
  onSlideChange,
}: LayoutTextOnlyProps) {
  return (
    <article className="flex flex-col justify-between w-full h-full min-h-[480px] bg-white p-8 md:p-12">

      <div className="flex-1 min-h-0">
        {editable ? (
          <textarea
            value={slide.title}
            onChange={(event) =>
              onSlideChange?.({ title: event.target.value })
            }
            rows={2}
            placeholder="Título de la diapositiva"
            className="w-full text-3xl md:text-4xl font-bold text-slate-800 mb-6 resize-none outline-none border-b border-transparent focus:border-blue-400 placeholder:text-slate-300"
          />
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            {slide.title}
          </h2>
        )}

        {editable ? (
          <textarea
            value={slide.content}
            onChange={(event) =>
              onSlideChange?.({ content: event.target.value })
            }
            placeholder="Escribe el contenido de la diapositiva..."
            className="w-full h-48 text-lg leading-relaxed text-slate-600 whitespace-pre-wrap resize-none outline-none border border-transparent focus:border-blue-300 rounded-md p-2"
          />
        ) : (
          <div className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap">
            {slide.content}
          </div>
        )}
      </div>

      <HeaderFooter
        slide={slide}
        slideNumber={slideNumber}
        totalSlides={totalSlides}
      />
    </article>
  );
}
