import type { Slide } from "./Slide";
export interface Project{
    id: string;
    name: string;
    description?: string;
    slide: Slide[];
    createdAt: string;
    updatedAt: string;
}

