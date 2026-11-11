import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type { IProjectRepository } from '../models/ports/IProjectRepository';
import type { Project } from '../models/Project';

interface UseProjectController {
  projects: Project[];
  loading: boolean;
  error: string | null;

  refreshProjects: () => Promise<void>;
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado.';
}

export function useProjectController(
  repository: IProjectRepository,
): UseProjectController {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await repository.initialize();

      const result = await repository.getAll();

      setProjects(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const createProject = useCallback(
    async (name: string) => {
      const normalizedName = name.trim();

      if (!normalizedName) {
        setError('El nombre del proyecto es obligatorio.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const now = new Date().toISOString();

        const project: Project = {
          id: crypto.randomUUID(),
          name: normalizedName,
          description: '',
          slide: [],
          createdAt: now,
          updatedAt: now,
        };

        await repository.save(project);

        await refreshProjects();
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    },
    [repository, refreshProjects],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        await repository.delete(id);

        await refreshProjects();
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    },
    [repository, refreshProjects],
  );

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects,
    createProject,
    deleteProject,
  };
}