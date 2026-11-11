import type { Project } from "../Project";

export interface IProjectRepository{
    initialize(): Promise<void>;

    getAll(): Promise<Project[]>;

    getById(id: string): Promise<Project | undefined>;

    save(project: Project): Promise<void>;

    delete(id:string): Promise<void>;
}