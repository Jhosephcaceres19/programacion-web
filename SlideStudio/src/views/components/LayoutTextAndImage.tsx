
import type { Slide } from '../../models/Slide';
import HeaderFooter from './HeaderFooter';

interface LayoutTextAndImageProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  editable?: boolean;
  onSlideChange?: (changes: Partial<Slide>) => void;
}

export default function LayoutTextAndImage({
  slide,
  slideNumber,
  totalSlides,
  editable = false,
  onSlideChange,
}: LayoutTextAndImageProps) {
  return (
    <article className="flex flex-col justify-between w-full h-full min-h-[480px] bg-white p-8 md:p-12">

      <div className="flex-1 min-h-0">
        {editable ? (
          <textarea
            value={slide.title}
            onChange={(event) =>
              onSlideChange?.({ title: event.target.value })
            }
            rows={1}
            placeholder="Título de la diapositiva"
            className="w-full text-3xl font-bold text-slate-800 mb-5 resize-none outline-none border-b border-transparent focus:border-blue-400"
          />
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            {slide.title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

          {/* Contenido */}
          <div className="min-w-0">
            {editable ? (
              <textarea
                value={slide.content}
                onChange={(event) =>
                  onSlideChange?.({ content: event.target.value })
                }
                placeholder="Escribe el contenido de la diapositiva..."
                className="w-full min-h-[180px] text-lg leading-relaxed text-slate-600 resize-none outline-none border border-transparent focus:border-blue-300 rounded-md p-2"
              />
            ) : (
              <div className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap">
                {slide.content}
              </div>
            )}
          </div>

          {/* Imagen */}
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 min-w-0">
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="max-h-[260px] max-w-full object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                <p className="text-slate-400">
                  No hay imagen
                </p>
              </div>
            )}

            {editable && (
              <input
                type="url"
                value={slide.imageUrl ?? ''}
                onChange={(event) =>
                  onSlideChange?.({ imageUrl: event.target.value })
                }
                placeholder="URL de la imagen"
                className="w-full border border-slate-200 focus:border-blue-400 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none"
              />
            )}
          </div>
        </div>
      </div>

      <HeaderFooter
        slide={slide}
        slideNumber={slideNumber}
        totalSlides={totalSlides}
      />
    </article>
  );
}
