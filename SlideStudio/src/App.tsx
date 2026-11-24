import { useCallback, useMemo, useState } from 'react';

import type { Project } from '../src/models/Project';
import type { Slide } from '../src/models/Slide';

import { IndexedDbProjectRepository } from '../src/infrastructure/IndexDbProjectRepository';
import { PresentationExporter } from './infrastructure/PresentationExporter';
import { useProjectController } from '../src/controllers/useProjectController';

// import EditorView from './containers/EditorView';
import EditorView from './views/containers/EditorView';
import PresentationView from './views/containers/PresentationView';

export default function App() {
  const repository = useMemo(
    () => new IndexedDbProjectRepository(),
    [],
  );
  const exporter = useMemo(() => new PresentationExporter(), []);

  const {
    projects,
    loading,
    error,
    refreshProjects,
  } = useProjectController(repository);

  const [selectedProjectId, setSelectedProjectId] = useState<
    string | null
  >(null);

  const [isPresentation, setIsPresentation] = useState(false);

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId,
  );

  async function createProject() {
    const name = window.prompt('Nombre del proyecto:');

    if (!name?.trim()) return;

    const now = new Date().toISOString();

    const projectId = crypto.randomUUID();

    const coverSlide: Slide = {
      id: crypto.randomUUID(),
      projectId,
      title: name.trim(),
      content: 'Subtítulo de la presentación',
      type: 'title',
      layout: 'text-only',
      author: '',
      topic: name.trim(),
      date: now,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };

    const project: Project = {
      id: projectId,
      name: name.trim(),
      description: '',
      slide: [coverSlide],
      createdAt: now,
      updatedAt: now,
    };

    try {
      await repository.initialize();
      await repository.save(project);
      await refreshProjects();

      setSelectedProjectId(projectId);
    } catch (err: unknown) {
      console.error('No se pudo crear el proyecto:', err);
      window.alert('No se pudo crear el proyecto.');
    }
  }

  const saveProject = useCallback(
    async (updatedProject: Project) => {
      try {
        await repository.save(updatedProject);
        await refreshProjects();
      } catch (err: unknown) {
        console.error('No se pudo guardar el proyecto:', err);
        window.alert('No se pudieron guardar los cambios.');
      }
    },
    [repository, refreshProjects],
  );

  const exitPresentation = useCallback(() => {
    setIsPresentation(false);
  }, []);

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          Cargando proyectos...
        </p>
      </div>
    );
  }

  if (selectedProject && isPresentation) {
    return (
      <PresentationView
        project={selectedProject}
        onExit={exitPresentation}
      />
    );
  }

  if (selectedProject) {
    return (
      <EditorView
        project={selectedProject}
        onProjectChange={saveProject}
        onStartPresentation={() => setIsPresentation(true)}
        onBack={() => setSelectedProjectId(null)}
        exporter={exporter}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="bg-slate-950 text-white px-8 py-6">
        <h1 className="text-3xl font-bold">
          SlideStudio
        </h1>

        <p className="text-slate-300 mt-2">
          Crea, edita y presenta tus diapositivas.
        </p>
      </header>

      <section className="max-w-6xl mx-auto p-8">

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Mis proyectos
            </h2>

            <p className="text-slate-500 mt-1">
              Tus presentaciones guardadas localmente.
            </p>
          </div>

          <button
            onClick={createProject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            + Nuevo proyecto
          </button>

        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">

            <h3 className="text-xl font-semibold text-slate-700">
              Todavía no tienes proyectos
            </h3>

            <p className="text-slate-500 mt-2">
              Crea tu primera presentación para comenzar.
            </p>

            <button
              onClick={createProject}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Crear mi primera presentación
            </button>

          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              >

                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center mb-5">

                  <span className="text-white text-2xl font-bold">
                    SlideStudio
                  </span>

                </div>

                <h3 className="font-bold text-lg text-slate-800">
                  {project.name}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  {project.slide.length} diapositivas
                </p>

                <button
                  onClick={() => setSelectedProjectId(project.id)}
                  className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                >
                  Abrir proyecto
                </button>

              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}
