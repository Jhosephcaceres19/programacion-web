export type SlideType = "title" | "content";

export type SlideLayout = "text-only" | "image-only" | "text-and-image";

export interface Slide {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: SlideType;
  layout: SlideLayout;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}