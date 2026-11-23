import type { Slide } from '../../models/Slide';

interface HeaderFooterProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

export default function HeaderFooter({
  slide,
  slideNumber,
  totalSlides,
}: HeaderFooterProps) {
  const date = slide.date
    ? new Date(slide.date).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">

      <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-500">
        <span>
          Autor: {slide.author || 'Sin autor'}
        </span>

        <span>
          Tema: {slide.topic || 'Sin tema'}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{date}</span>

        <span>
          Diapositiva {slideNumber} de {totalSlides}
        </span>
      </div>

    </div>
  );
}