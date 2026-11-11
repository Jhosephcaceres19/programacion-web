import 'fake-indexeddb/auto';


import type { Project } from '../models/Project';
import { IndexedDbProjectRepository } from '../infrastructure/IndexDbProjectRepository';

describe('IndexedDbProjectRepository', () => {
  let repository: IndexedDbProjectRepository;
  let databaseName: string;

  const project: Project = {
    id: 'project-1',
    name: 'Mi primera presentación',
    description: 'Proyecto de prueba',
    slide: [],

    createdAt: '2026-11-11T10:00:00.000Z',
    updatedAt: '2026-11-11T10:00:00.000Z',
  };

  beforeEach(() => {
    databaseName = `SlideStudioTest_${Date.now()}_${Math.random()}`;

    repository = new IndexedDbProjectRepository(databaseName);
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(databaseName);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(
        new Error('La eliminación de la base de datos fue bloqueada.'),
      );
    });
  });

  test('debe inicializar la base de datos', async () => {
    await repository.initialize();

    const projects = await repository.getAll();

    expect(projects).toEqual([]);
  });

  test('debe guardar un proyecto', async () => {
    await repository.save(project);

    const savedProject = await repository.getById(project.id);

    expect(savedProject).toEqual(project);
  });

  test('debe recuperar todos los proyectos', async () => {
    const secondProject: Project = {
      ...project,
      id: 'project-2',
      name: 'Segunda presentación',
    };

    await repository.save(project);
    await repository.save(secondProject);

    const projects = await repository.getAll();

    expect(projects).toHaveLength(2);
  });

  test('debe recuperar un proyecto por su identificador', async () => {
    await repository.save(project);

    const result = await repository.getById('project-1');

    expect(result?.name).toBe('Mi primera presentación');
  });

  test('debe devolver undefined si el proyecto no existe', async () => {
    const result = await repository.getById('inexistente');

    expect(result).toBeUndefined();
  });

  test('debe eliminar un proyecto', async () => {
    await repository.save(project);

    await repository.delete(project.id);

    const result = await repository.getById(project.id);

    expect(result).toBeUndefined();
  });

  test('debe actualizar un proyecto existente', async () => {
    await repository.save(project);

    const updatedProject: Project = {
      ...project,
      name: 'Presentación actualizada',
    };

    await repository.save(updatedProject);

    const result = await repository.getById(project.id);

    expect(result?.name).toBe('Presentación actualizada');
  });
});