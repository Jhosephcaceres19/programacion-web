import type { Slide } from '../../models/Slide';
import HeaderFooter from './HeaderFooter';

interface LayoutTextOnlyProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

export default function LayoutTextOnly({
  slide,
  slideNumber,
  totalSlides,
}: LayoutTextOnlyProps) {
  return (
    <article className="flex flex-col justify-between w-full h-full min-h-[480px] bg-white p-8 md:p-12">

      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
          {slide.title}
        </h2>

        <div className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap">
          {slide.content}
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