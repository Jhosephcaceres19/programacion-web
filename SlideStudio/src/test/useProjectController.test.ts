import { act, renderHook, waitFor } from '@testing-library/react';

import { useProjectController } from '../controllers/useProjectController';
import type { IProjectRepository } from '../models/ports/IProjectRepository';
import type { Project } from '../models/Project';

describe('useProjectController', () => {
  let repository: jest.Mocked<IProjectRepository>;

  const project: Project = {
    id: 'project-1',
    name: 'Presentación de prueba',
    description: '',
    slide: [],
    createdAt: '2026-11-11T10:00:00.000Z',
    updatedAt: '2026-11-11T10:00:00.000Z',
  };

  beforeEach(() => {
    repository = {
      initialize: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      getAll: jest.fn().mockResolvedValue([project]),
      getById: jest.fn().mockResolvedValue(project),
      delete: jest.fn().mockResolvedValue(undefined),
    };
  });

  test('debe cargar los proyectos al iniciar', async () => {
    const { result } = renderHook(() =>
      useProjectController(repository),
    );

    await waitFor(() => {
      expect(result.current.projects).toHaveLength(1);
    });

    expect(repository.initialize).toHaveBeenCalled();
    expect(repository.getAll).toHaveBeenCalled();
  });

  test('debe crear un proyecto', async () => {
    repository.getAll
      .mockResolvedValueOnce([project])
      .mockResolvedValueOnce([
        project,
        {
          ...project,
          id: 'new-project',
          name: 'Nuevo proyecto',
        },
      ]);

    const { result } = renderHook(() =>
      useProjectController(repository),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createProject('Nuevo proyecto');
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Nuevo proyecto',
        slides: [],
      }),
    );
  });

  test('debe eliminar un proyecto', async () => {
    const { result } = renderHook(() =>
      useProjectController(repository),
    );

    await waitFor(() => {
      expect(result.current.projects).toHaveLength(1);
    });

    await act(async () => {
      await result.current.deleteProject('project-1');
    });

    expect(repository.delete).toHaveBeenCalledWith('project-1');
  });

  test('debe gestionar errores al cargar proyectos', async () => {
    repository.initialize.mockRejectedValue(
      new Error('Error de IndexedDB'),
    );

    const { result } = renderHook(() =>
      useProjectController(repository),
    );

    await waitFor(() => {
      expect(result.current.error).toBe('Error de IndexedDB');
    });
  });

  test('debe permitir actualizar la lista manualmente', async () => {
    const { result } = renderHook(() =>
      useProjectController(repository),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    repository.getAll.mockResolvedValue([
      project,
      {
        ...project,
        id: 'project-2',
        name: 'Segundo proyecto',
      },
    ]);

    await act(async () => {
      await result.current.refreshProjects();
    });

    expect(result.current.projects).toHaveLength(2);
  });
});