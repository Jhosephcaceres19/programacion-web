import type { Slide } from '../../models/Slide';
import HeaderFooter from './HeaderFooter';

interface LayoutTextAndImageProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

export default function LayoutTextAndImage({
  slide,
  slideNumber,
  totalSlides,
}: LayoutTextAndImageProps) {
  return (
    <article className="flex flex-col justify-between w-full h-full min-h-[480px] bg-white p-8 md:p-12">

      <div className="flex-1">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          {slide.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          <div className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap">
            {slide.content}
          </div>

          <div className="flex items-center justify-center min-h-[200px]">
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="max-h-[320px] max-w-full object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                <p className="text-slate-400">
                  No hay imagen
                </p>
              </div>
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