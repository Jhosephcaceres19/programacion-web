import type { Project } from '../Project';

export interface IExporter {
  exportHtml(project: Project): Promise<void>;
  exportPdf(project: Project): void;
  exportPowerPoint(project: Project): Promise<void>;
}
