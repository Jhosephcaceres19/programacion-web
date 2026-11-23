import type { Slide } from '../../models/Slide';

import LayoutTextOnly from './LayoutTextOnly';
import LayoutImageOnly from './LayoutImageOnly';
import LayoutTextAndImage from './LayoutTextAndImage';

interface SlideRendererProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

export default function SlideRenderer({
  slide,
  slideNumber,
  totalSlides,
}: SlideRendererProps) {

  // La primera diapositiva es la portada.
  if (slide.type === 'title') {
    return (
      <article className="flex flex-col items-center justify-center text-center w-full h-full min-h-[480px] bg-gradient-to-br from-blue-950 to-blue-700 text-white p-12">

        <p className="uppercase tracking-[0.3em] text-blue-200 text-sm mb-8">
          {slide.topic || 'Presentación'}
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          {slide.title}
        </h1>

        <p className="text-xl text-blue-100 max-w-2xl whitespace-pre-wrap">
          {slide.content}
        </p>

        <div className="mt-16 text-blue-200">
          <p>{slide.author || 'Autor'}</p>
          <p className="text-sm mt-2">
            {slide.date || new Date().toLocaleDateString()}
          </p>
        </div>

      </article>
    );
  }

  // Diapositivas de desarrollo.
  switch (slide.layout) {

    case 'text-only':
      return (
        <LayoutTextOnly
          slide={slide}
          slideNumber={slideNumber}
          totalSlides={totalSlides}
        />
      );

    case 'image-only':
      return (
        <LayoutImageOnly
          slide={slide}
          slideNumber={slideNumber}
          totalSlides={totalSlides}
        />
      );

    case 'text-and-image':
      return (
        <LayoutTextAndImage
          slide={slide}
          slideNumber={slideNumber}
          totalSlides={totalSlides}
        />
      );

    default:
      return (
        <LayoutTextOnly
          slide={slide}
          slideNumber={slideNumber}
          totalSlides={totalSlides}
        />
      );
  }
}