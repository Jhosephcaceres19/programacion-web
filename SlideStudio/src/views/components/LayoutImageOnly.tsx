
import type { Slide } from '../../models/Slide';
import HeaderFooter from './HeaderFooter';

interface LayoutImageOnlyProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  editable?: boolean;
  onSlideChange?: (changes: Partial<Slide>) => void;
}

export default function LayoutImageOnly({
  slide,
  slideNumber,
  totalSlides,
  editable = false,
  onSlideChange,
}: LayoutImageOnlyProps) {
  return (
    <article className="flex flex-col justify-between w-full h-full min-h-[480px] bg-white p-8 md:p-12">

      <div className="flex-1 flex flex-col min-h-0">
        {editable ? (
          <textarea
            value={slide.title}
            onChange={(event) =>
              onSlideChange?.({ title: event.target.value })
            }
            rows={1}
            placeholder="Título de la diapositiva"
            className="w-full text-3xl font-bold text-slate-800 mb-4 resize-none outline-none border-b border-transparent focus:border-blue-400"
          />
        ) : (
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            {slide.title}
          </h2>
        )}

        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden gap-3">
          {slide.imageUrl ? (
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="max-h-[300px] max-w-full object-contain rounded-lg"
            />
          ) : (
            <div className="flex-1 w-full min-h-[180px] flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
              <p className="text-slate-400">
                No hay ninguna imagen agregada
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
              placeholder="Pega aquí la URL de la imagen"
              className="w-full max-w-xl border border-slate-200 focus:border-blue-400 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none"
            />
          )}
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
