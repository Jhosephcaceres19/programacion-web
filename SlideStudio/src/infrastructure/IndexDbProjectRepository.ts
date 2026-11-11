import type { Project } from '../models/Project';
import type { IProjectRepository } from '../models/ports/IProjectRepository';

const DATABASE_VERSION = 1;
const STORE_NAME = 'projects';

export class IndexedDbProjectRepository
  implements IProjectRepository {

  private databasePromise?: Promise<IDBDatabase>;

 private readonly databaseName: string;

constructor(databaseName = 'SlideStudioDB') {
  this.databaseName = databaseName;
}

  async initialize(): Promise<void> {
    await this.getDatabase();
  }

  private getDatabase(): Promise<IDBDatabase> {
    if (this.databasePromise) {
      return this.databasePromise;
    }

    this.databasePromise = new Promise<IDBDatabase>(
      (resolve, reject) => {
        const request = indexedDB.open(
          this.databaseName,
          DATABASE_VERSION,
        );

        request.onupgradeneeded = () => {
          const database = request.result;

          if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME, {
              keyPath: 'id',
            });
          }
        };

        request.onsuccess = () => {
          const database = request.result;

          database.onversionchange = () => {
            database.close();
            this.databasePromise = undefined;
          };

          resolve(database);
        };

        request.onerror = () => {
          this.databasePromise = undefined;

          reject(
            request.error ??
              new Error('No se pudo abrir la base de datos.'),
          );
        };

        request.onblocked = () => {
          this.databasePromise = undefined;

          reject(
            new Error('La apertura de IndexedDB fue bloqueada.'),
          );
        };
      },
    );

    return this.databasePromise;
  }

  async save(project: Project): Promise<void> {
    const database = await this.getDatabase();

    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        STORE_NAME,
        'readwrite',
      );

      const store = transaction.objectStore(STORE_NAME);

      store.put(project);

      transaction.oncomplete = () => resolve();

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error('No se pudo guardar el proyecto.'),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error('La operación de guardado fue cancelada.'),
        );
      };
    });
  }

  async getAll(): Promise<Project[]> {
    const database = await this.getDatabase();

    return new Promise<Project[]>((resolve, reject) => {
      const transaction = database.transaction(
        STORE_NAME,
        'readonly',
      );

      const request = transaction
        .objectStore(STORE_NAME)
        .getAll();

      request.onsuccess = () => resolve(
        request.result as Project[],
      );

      request.onerror = () => {
        reject(
          request.error ??
            new Error('No se pudieron recuperar los proyectos.'),
        );
      };
    });
  }

  async getById(id: string): Promise<Project | undefined> {
    const database = await this.getDatabase();

    return new Promise<Project | undefined>((resolve, reject) => {
      const transaction = database.transaction(
        STORE_NAME,
        'readonly',
      );

      const request = transaction
        .objectStore(STORE_NAME)
        .get(id);

      request.onsuccess = () => {
        resolve(request.result as Project | undefined);
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error('No se pudo recuperar el proyecto.'),
        );
      };
    });
  }

  async delete(id: string): Promise<void> {
    const database = await this.getDatabase();

    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        STORE_NAME,
        'readwrite',
      );

      transaction.objectStore(STORE_NAME).delete(id);

      transaction.oncomplete = () => resolve();

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error('No se pudo eliminar el proyecto.'),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error('La eliminación fue cancelada.'),
        );
      };
    });
  }
}