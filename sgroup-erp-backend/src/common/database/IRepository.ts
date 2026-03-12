/**
 * Base Repository Interface — generic contract for all data adapters.
 * Both PrismaAdapter and GoogleSheetsAdapter implement this.
 */
export interface IRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  findAll(filters?: Record<string, any>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<T | void>;
  count(filters?: Record<string, any>): Promise<number>;
}

/**
 * Extended repository with upsert support (used by planning modules).
 */
export interface IUpsertRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>
  extends IRepository<T, CreateDTO, UpdateDTO> {
  upsert(where: Record<string, any>, create: CreateDTO, update: UpdateDTO): Promise<T>;
}

/**
 * Extended repository with transaction support.
 */
export interface ITransactionalRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>
  extends IRepository<T, CreateDTO, UpdateDTO> {
  transaction<R>(fn: () => Promise<R>): Promise<R>;
}
