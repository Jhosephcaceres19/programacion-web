import type { Slide } from '../../models/Slide';
import HeaderFooter from './HeaderFooter';

interface LayoutImageOnlyProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

export default function LayoutImageOnly({
  slide,
  slideNumber,
  totalSlides,
}: LayoutImageOnlyProps) {
  return (
    <article className="flex flex-col justify-between w-full h-full min-h-[480px] bg-white p-8 md:p-12">

      <div className="flex-1 flex flex-col">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          {slide.title}
        </h2>

        {slide.imageUrl ? (
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="max-h-[400px] max-w-full object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
            <p className="text-slate-400">
              No hay ninguna imagen agregada
            </p>
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