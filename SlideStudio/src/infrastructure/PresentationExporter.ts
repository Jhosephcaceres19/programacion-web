import type { Project } from '../models/Project';
import type { Slide } from '../models/Slide';
import type { IExporter } from '../models/ports/IExporter';

function orderedSlides(project: Project): Slide[] {
  return [...project.slide].sort((a, b) => a.order - b.order);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function safeFileName(name: string): string {
  return name.trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '') || 'presentacion';
}

function slideMarkup(slide: Slide, index: number, total: number): string {
  const isCover = slide.type === 'title';
  const title = escapeHtml(slide.title);
  const content = escapeHtml(slide.content);
  const topic = escapeHtml(slide.topic ?? 'Presentación');
  const author = escapeHtml(slide.author ?? '');
  const date = escapeHtml(slide.date ?? '');
  const image = slide.imageUrl
    ? `<img class="slide-image" src="${escapeHtml(slide.imageUrl)}" alt="${title}">`
    : '';

  if (isCover) {
    return `<section class="slide cover"><div class="cover-inner"><p class="topic">${topic}</p><h1>${title}</h1><p class="cover-content">${content}</p><p class="author">${author}${date ? ` · ${date}` : ''}</p></div></section>`;
  }

  const body = slide.layout === 'image-only'
    ? `<div class="image-only">${image || '<p class="muted">No hay ninguna imagen agregada</p>'}</div>`
    : slide.layout === 'text-and-image'
      ? `<div class="two-columns"><p class="content">${content}</p><div class="image-wrap">${image || '<p class="muted">No hay imagen</p>'}</div></div>`
      : `<p class="content">${content}</p>`;

  return `<section class="slide"><h2>${title}</h2><div class="slide-body">${body}</div><footer><span>${author}</span><span>${index + 1} / ${total}</span></footer></section>`;
}

function createHtml(project: Project): string {
  const slides = orderedSlides(project);
  const markup = slides.map((slide, index) => slideMarkup(slide, index, slides.length)).join('\n');
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(project.name)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#0f172a;color:#1e293b;font-family:Arial,Helvetica,sans-serif}.toolbar{position:sticky;top:0;z-index:2;display:flex;justify-content:center;gap:12px;padding:12px;background:#020617;color:white}.toolbar button{border:0;border-radius:8px;background:#2563eb;color:white;padding:10px 18px;font-size:14px;cursor:pointer}.toolbar button:disabled{opacity:.45}.deck{padding:24px;display:grid;gap:24px}.slide{position:relative;width:min(100%,1280px);aspect-ratio:16/9;min-height:360px;margin:auto;padding:7%;overflow:hidden;background:white;box-shadow:0 16px 48px #0005;display:flex;flex-direction:column}.cover{align-items:center;justify-content:center;text-align:center;color:white;background:linear-gradient(135deg,#172554,#1d4ed8)}.cover-inner{max-width:900px}.topic{text-transform:uppercase;letter-spacing:.25em;color:#bfdbfe;font-size:clamp(12px,1.5vw,20px);margin:0 0 36px}.cover h1{font-size:clamp(36px,6vw,76px);margin:0 0 24px}.cover-content{font-size:clamp(18px,2.5vw,30px);color:#dbeafe;white-space:pre-wrap}.author{margin-top:42px;color:#bfdbfe}.slide h2{font-size:clamp(28px,4vw,52px);margin:0 0 32px;color:#1e293b}.slide-body{flex:1;min-height:0}.content{font-size:clamp(18px,2.1vw,28px);line-height:1.55;color:#475569;white-space:pre-wrap;margin:0}.two-columns{height:100%;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center}.image-wrap,.image-only{display:flex;justify-content:center;align-items:center;min-height:0;height:100%}.slide-image{max-width:100%;max-height:100%;object-fit:contain;border-radius:10px}.muted{color:#94a3b8}footer{display:flex;justify-content:space-between;margin-top:24px;color:#64748b;font-size:14px}.hidden{display:none!important}
@media(max-width:700px){.deck{padding:12px}.slide{min-height:300px;padding:7%}.two-columns{gap:12px}.content{font-size:16px}}
@media print{@page{size:landscape;margin:0}body{background:white}.toolbar{display:none!important}.deck{display:block;padding:0}.slide{width:100vw;height:100vh;min-height:0;aspect-ratio:auto;margin:0;box-shadow:none;break-after:page;page-break-after:always}.slide.hidden{display:flex!important}.slide:last-child{break-after:auto;page-break-after:auto}}
</style></head><body><nav class="toolbar"><button id="prev" type="button">← Anterior</button><span id="counter" aria-live="polite"></span><button id="next" type="button">Siguiente →</button><button type="button" onclick="window.print()">Imprimir / guardar PDF</button></nav><main class="deck">${markup}</main>
<script>const slides=[...document.querySelectorAll('.slide')];let current=0;function show(i){current=Math.max(0,Math.min(i,slides.length-1));slides.forEach((s,n)=>s.classList.toggle('hidden',n!==current));document.querySelector('#counter').textContent=slides.length?(current+1)+' / '+slides.length:'0 / 0';document.querySelector('#prev').disabled=current===0;document.querySelector('#next').disabled=current===slides.length-1}document.querySelector('#prev').onclick=()=>show(current-1);document.querySelector('#next').onclick=()=>show(current+1);document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();show(current+1)}if(e.key==='ArrowLeft')show(current-1)});show(0);</script></body></html>`;
}

function downloadBlob(content: BlobPart, fileName: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function imageAsDataUrl(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : undefined);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

async function projectWithEmbeddedImages(project: Project): Promise<{ project: Project; externalImageCount: number }> {
  let externalImageCount = 0;
  const slides = await Promise.all(project.slide.map(async (slide) => {
    if (!slide.imageUrl || slide.imageUrl.startsWith('data:')) return slide;
    const imageUrl = await imageAsDataUrl(slide.imageUrl);
    if (!imageUrl) {
      externalImageCount += 1;
      return slide;
    }
    return { ...slide, imageUrl };
  }));
  return { project: { ...project, slide: slides }, externalImageCount };
}

export class PresentationExporter implements IExporter {
  async exportHtml(project: Project): Promise<void> {
    const exported = await projectWithEmbeddedImages(project);
    downloadBlob(createHtml(exported.project), `${safeFileName(project.name)}.html`, 'text/html;charset=utf-8');
    if (exported.externalImageCount > 0) {
      window.alert('Algunas imágenes no permiten incrustación; el HTML las cargará desde sus URL originales.');
    }
  }

  exportPdf(project: Project): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.alert('Permite las ventanas emergentes para imprimir o guardar el PDF.');
      return;
    }
    void projectWithEmbeddedImages(project).then((exported) => {
      printWindow.document.open();
      printWindow.document.write(createHtml(exported.project));
      printWindow.document.close();
      if (exported.externalImageCount > 0) {
        window.alert('Algunas imágenes siguen dependiendo de sus URL y necesitan conexión al generar el PDF.');
      }
      printWindow.addEventListener('load', () => {
        const images = [...printWindow.document.images];
        void Promise.all(images.map((image) => image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => resolve(), { once: true });
            })))
          .then(() => printWindow.print());
      }, { once: true });
    });
  }

  async exportPowerPoint(project: Project): Promise<void> {
    const { default: PptxGenJS } = await import('pptxgenjs');
    let externalImageCount = 0;
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = orderedSlides(project)[0]?.author ?? '';
    pptx.subject = 'Presentación exportada desde SlideStudio';
    pptx.title = project.name;
    pptx.company = 'SlideStudio';
    pptx.theme = {
      headFontFace: 'Aptos Display',
      bodyFontFace: 'Aptos',
    };

    const slides = orderedSlides(project);
    for (const [index, data] of slides.entries()) {
      const slide = pptx.addSlide();
      const isCover = data.type === 'title';
      if (isCover) {
        slide.background = { color: '172554' };
        slide.addText(data.topic || 'Presentación', {
          x: 0.8, y: 1.25, w: 11.7, h: 0.45, fontFace: 'Aptos', fontSize: 16,
          color: 'BFDBFE', charSpacing: 3, align: 'center', margin: 0,
        });
        slide.addText(data.title, {
          x: 0.8, y: 2.15, w: 11.7, h: 1.6, fontFace: 'Aptos Display',
          fontSize: 38, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle',
          breakLine: false, fit: 'shrink', margin: 0.08,
        });
        slide.addText(data.content, {
          x: 1.2, y: 4.05, w: 10.9, h: 0.8, fontSize: 20, color: 'DBEAFE',
          align: 'center', valign: 'middle', breakLine: false, fit: 'shrink', margin: 0.08,
        });
        const byline = [data.author, data.date].filter(Boolean).join(' · ');
        if (byline) slide.addText(byline, { x: 1, y: 5.7, w: 11.3, h: 0.35, fontSize: 12, color: 'BFDBFE', align: 'center', margin: 0 });
        continue;
      }

      slide.background = { color: 'FFFFFF' };
      slide.addText(data.title, {
        x: 0.7, y: 0.55, w: 11.9, h: 0.8, fontFace: 'Aptos Display', fontSize: 28,
        bold: true, color: '1E293B', fit: 'shrink', margin: 0.04,
      });
      if (data.layout === 'image-only') {
        if (data.imageUrl) {
          const dataUrl = await imageAsDataUrl(data.imageUrl);
          if (dataUrl) slide.addImage(pptxSizing(dataUrl, 1.3, 1.7, 10.7, 4.9));
          else externalImageCount += 1;
        } else {
          slide.addText('No hay ninguna imagen agregada', { x: 1, y: 3.2, w: 11.3, h: 0.5, color: '94A3B8', fontSize: 16, align: 'center' });
        }
      } else {
        slide.addText(data.content, {
          x: 0.85, y: 1.7, w: data.layout === 'text-and-image' ? 5.5 : 11.5, h: 4.65,
          fontFace: 'Aptos', fontSize: 19, color: '475569', valign: 'top',
          breakLine: false, fit: 'shrink', margin: 0.1,
        });
        if (data.layout === 'text-and-image' && data.imageUrl) {
          const dataUrl = await imageAsDataUrl(data.imageUrl);
          if (dataUrl) slide.addImage(pptxSizing(dataUrl, 6.7, 1.8, 5.6, 4.45));
          else externalImageCount += 1;
        }
      }
      const footer = [data.author, `${index + 1} / ${slides.length}`].filter(Boolean).join('    ·    ');
      slide.addText(footer, { x: 0.8, y: 6.85, w: 11.8, h: 0.25, fontSize: 10, color: '64748B', margin: 0 });
    }
    await pptx.writeFile({ fileName: `${safeFileName(project.name)}.pptx` });
    if (externalImageCount > 0) {
      window.alert('El archivo se exportó, pero algunas imágenes no se pudieron cargar por restricciones de origen.');
    }
  }
}

function pptxSizing(data: string, x: number, y: number, w: number, h: number) {
  return { data, x, y, w, h, sizing: { type: 'contain' as const, w, h } };
}
