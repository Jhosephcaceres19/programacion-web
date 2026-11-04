export interface Project{
    id: string;
    name: string;
    slide: Slide[];
}

export interface Slide {
    id: string;
    title: string;
    content: string;
}